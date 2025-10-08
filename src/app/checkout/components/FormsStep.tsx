import React, { useMemo } from 'react';
import { EventCatalogItem } from '../../../lib/eventCatalog';
import { CheckoutState, FormField } from '../types';
import { getEventFields, validateEmail, validatePhone, getTeamSizeConfig } from '../utils';
import { SOLO_FIELDS, VISITOR_PASS_FIELDS } from '../constants';
import { FormFieldInput } from './FormFieldInput';

interface FormsStepProps {
  selectedEvents: EventCatalogItem[];
  state: CheckoutState;
  updateState: (updates: Partial<CheckoutState>) => void;
  filesBySignature: Record<string, Record<string, File>>;
  setFilesBySignature: React.Dispatch<React.SetStateAction<Record<string, Record<string, File>>>>;
  memberFilesBySignature: Record<string, Record<number, File>>;
  setMemberFilesBySignature: React.Dispatch<React.SetStateAction<Record<string, Record<number, File>>>>;
  formErrors: Record<string, Record<string, string>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  onNext: () => void;
}

export function FormsStep({
  selectedEvents,
  state,
  updateState,
  filesBySignature,
  setFilesBySignature,
  memberFilesBySignature,
  setMemberFilesBySignature,
  formErrors,
  setFormErrors,
  onNext,
}: FormsStepProps) {
  // Group events by form type
  const fieldGroups = useMemo(() => {
    const groups: { signature: string; fields: FormField[]; events: EventCatalogItem[] }[] = [];
    const soloEvents: EventCatalogItem[] = [];
    const teamEvents: EventCatalogItem[] = [];

    for (const ev of selectedEvents) {
      const fields = getEventFields(ev);
      const isSoloEvent = fields === SOLO_FIELDS;

      if (isSoloEvent) {
        soloEvents.push(ev);
      } else {
        teamEvents.push(ev);
      }
    }

    // Group all solo events together
    if (soloEvents.length > 0) {
      const soloSignature = `solo_events_${soloEvents.map(e => e.id).join('_')}`;
      groups.push({ signature: soloSignature, fields: SOLO_FIELDS, events: soloEvents });
    }

    // Keep team events separate
    for (const ev of teamEvents) {
      const fields = getEventFields(ev);
      const signature = `event_${ev.id}`;
      groups.push({ signature, fields, events: [ev] });
    }

    return groups;
  }, [selectedEvents]);

  // Handle field changes
  const handleFieldChange = (signature: string, fieldName: string, value: string) => {
    updateState({
      formDataBySignature: {
        ...state.formDataBySignature,
        [signature]: {
          ...state.formDataBySignature[signature],
          [fieldName]: value,
        },
      },
    });
  };

  // Handle file changes
  const handleFileChange = (signature: string, fieldName: string, file: File | null) => {
    if (file) {
      setFilesBySignature(prev => {
        const updated = {
          ...prev,
          [signature]: {
            ...prev[signature],
            [fieldName]: file,
          },
        };
        return updated;
      });
    } else {
      setFilesBySignature(prev => {
        const updated = { ...prev };
        if (updated[signature]) {
          delete updated[signature][fieldName];
        }
        return updated;
      });
    }
  };

  // Handle team member changes
  const handleMemberFieldChange = (signature: string, memberIndex: number, fieldName: string, value: string) => {
    const members = state.teamMembersBySignature[signature] || [];
    const updatedMembers = [...members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      [fieldName]: value,
    };
    updateState({
      teamMembersBySignature: {
        ...state.teamMembersBySignature,
        [signature]: updatedMembers,
      },
    });
  };

  // Handle team member file changes - BACKUP FILE LOGIC
  const handleMemberFileChange = (signature: string, memberIndex: number, file: File | null) => {
    console.log('🚀 MEMBER FILE CHANGE:', { signature, memberIndex, fileName: file?.name });
    
    if (file) {
      setMemberFilesBySignature(prev => ({
        ...prev,
        [signature]: {
          ...(prev[signature] || {}),
          [memberIndex]: file,
        },
      }));
      console.log('✅ FILE STORED at index:', memberIndex);
    } else {
      setMemberFilesBySignature(prev => {
        const updated = { ...prev };
        if (updated[signature]) {
          delete updated[signature][memberIndex];
        }
        return updated;
      });
      console.log('❌ FILE REMOVED at index:', memberIndex);
    }
  };

  // Add team member
  const addTeamMember = (signature: string) => {
    const members = state.teamMembersBySignature[signature] || [];
    const newMember = SOLO_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
    updateState({
      teamMembersBySignature: {
        ...state.teamMembersBySignature,
        [signature]: [...members, newMember],
      },
    });
  };

  // Remove team member
  const removeTeamMember = (signature: string, memberIndex: number) => {
    const members = state.teamMembersBySignature[signature] || [];
    updateState({
      teamMembersBySignature: {
        ...state.teamMembersBySignature,
        [signature]: members.filter((_, idx) => idx !== memberIndex),
      },
    });
    // Also remove file if exists
    if (memberFilesBySignature[signature]?.[memberIndex]) {
      setMemberFilesBySignature(prev => {
        const updated = { ...prev };
        if (updated[signature]) {
          delete updated[signature][memberIndex];
        }
        return updated;
      });
    }
  };

  // Validate and proceed
  const handleSubmit = () => {
    const errors: Record<string, Record<string, string>> = {};
    let isValid = true;

    // Validate visitor pass
    if (state.visitorPassDays > 0) {
      errors['visitorPass'] = {};
      VISITOR_PASS_FIELDS.forEach(field => {
        if (field.required) {
          if (field.type === 'file') {
            const file = filesBySignature['visitorPass']?.[field.name];
            if (!file) {
              errors['visitorPass'][field.name] = `${field.label} is required`;
              isValid = false;
            }
          } else {
            const value = state.visitorPassDetails[field.name] || '';
            if (!value.trim()) {
              errors['visitorPass'][field.name] = `${field.label} is required`;
              isValid = false;
            } else if (field.name === 'contactNo' && !validatePhone(value)) {
              errors['visitorPass'][field.name] = 'Mobile number must be exactly 10 digits';
              isValid = false;
            } else if (field.name === 'collegeMailId' && !validateEmail(value)) {
              errors['visitorPass'][field.name] = 'Please enter a valid email address';
              isValid = false;
            }
          }
        }
      });
    }

    // Validate event forms
    fieldGroups.forEach(group => {
      errors[group.signature] = {};
      group.fields.forEach(field => {
        if (field.required) {
          if (field.type === 'file') {
            const file = filesBySignature[group.signature]?.[field.name];
            if (!file) {
              errors[group.signature][field.name] = `${field.label} is required`;
              isValid = false;
            }
          } else {
            const value = state.formDataBySignature[group.signature]?.[field.name] || '';
            if (!value.trim()) {
              errors[group.signature][field.name] = `${field.label} is required`;
              isValid = false;
            } else if (field.name === 'contactNo' && !validatePhone(value)) {
              errors[group.signature][field.name] = 'Mobile number must be exactly 10 digits';
              isValid = false;
            } else if (field.name === 'collegeMailId' && !validateEmail(value)) {
              errors[group.signature][field.name] = 'Please enter a valid email address';
              isValid = false;
            }
          }
        }
      });

      // Validate team members if this is a team event
      const isTeamGroup = group.fields.some(f => f.name === 'teamName');
      if (isTeamGroup) {
        const members = state.teamMembersBySignature[group.signature] || [];
        const event = group.events[0];
        const teamConfig = event ? getTeamSizeConfig(event.title) : null;

        // Check if minimum team size is met
        if (teamConfig) {
          const currentTeamSize = members.length + 1; // +1 for the leader
          if (currentTeamSize < teamConfig.min) {
            errors[group.signature]['teamSize'] = `This event requires a minimum of ${teamConfig.min} members. You currently have ${currentTeamSize} (including leader). Please add ${teamConfig.min - currentTeamSize} more team member(s).`;
            isValid = false;
          }
        }

        // Validate each team member's details
        members.forEach((member, idx) => {
          SOLO_FIELDS.forEach(field => {
            if (!field.required) return;
            if (field.type === 'file') {
              const file = memberFilesBySignature[group.signature]?.[idx];
              if (!file) {
                errors[group.signature][`member_${idx}_${field.name}`] = `${field.label} is required for team member ${idx + 2}`;
                isValid = false;
              }
            } else {
              const value = member[field.name] || '';
              if (!value.trim()) {
                errors[group.signature][`member_${idx}_${field.name}`] = `${field.label} is required for team member ${idx + 2}`;
                isValid = false;
              } else if (field.name === 'contactNo' && !validatePhone(value)) {
                errors[group.signature][`member_${idx}_${field.name}`] = 'Mobile number must be exactly 10 digits';
                isValid = false;
              } else if (field.name === 'collegeMailId' && !validateEmail(value)) {
                errors[group.signature][`member_${idx}_${field.name}`] = 'Please enter a valid email address';
                isValid = false;
              }
            }
          });
        });
      }
    });

    setFormErrors(errors);

    if (isValid) {
      const event = new CustomEvent('proceedToReview');
      window.dispatchEvent(event);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Count total errors
  const totalErrors = Object.values(formErrors).reduce((sum, errorGroup) => sum + Object.keys(errorGroup).length, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Your Details</span>
        </h2>
        <p className="text-gray-400 mb-6">Fill in your information for registration</p>
      </div>

      {/* Error Summary */}
      {totalErrors > 0 && (
        <div className="bg-red-500/10 backdrop-blur-sm p-4 rounded-xl border border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-400 mb-1">Please fix {totalErrors} error{totalErrors > 1 ? 's' : ''}</p>
              <p className="text-sm text-white/70">Scroll down to see which fields need attention</p>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Pass Form */}
      {state.visitorPassDays > 0 && (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
          <h3 className="text-xl font-semibold mb-4 text-yellow-200">Visitor Pass Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISITOR_PASS_FIELDS.map(field => (
              <FormFieldInput
                key={field.name}
                field={field}
                value={state.visitorPassDetails[field.name] || ''}
                onChange={(value: string) => {
                  updateState({
                    visitorPassDetails: {
                      ...state.visitorPassDetails,
                      [field.name]: value,
                    },
                  });
                }}
                onFileChange={(file: File | null) => {
                  if (field.type === 'file') {
                    handleFileChange('visitorPass', field.name, file);
                  }
                }}
                uploadedFile={field.type === 'file' ? filesBySignature['visitorPass']?.[field.name] : undefined}
                uniqueId={`file-visitorPass-${field.name}`}
                error={formErrors['visitorPass']?.[field.name]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Event Forms */}
      {fieldGroups.map(group => (
        <div key={group.signature} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.2)]">
          <h3 className="text-xl font-semibold mb-2">
            <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              {group.events.length === 1 ? group.events[0].title : 'Event Registration'}
            </span>
          </h3>
          {group.events.length > 1 && (
            <p className="text-sm text-white/60 mb-4">
              Registration for: {group.events.map(e => e.title).join(', ')}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map(field => (
              <FormFieldInput
                key={field.name}
                field={field}
                value={state.formDataBySignature[group.signature]?.[field.name] || ''}
                onChange={(value: string) => handleFieldChange(group.signature, field.name, value)}
                onFileChange={(file: File | null) => handleFileChange(group.signature, field.name, file)}
                uploadedFile={field.type === 'file' ? filesBySignature[group.signature]?.[field.name] : undefined}
                uniqueId={`file-${group.signature}-${field.name}`}
                error={formErrors[group.signature]?.[field.name]}
              />
            ))}
          </div>

          {/* Team Members Section */}
          {group.fields.some(f => f.name === 'teamName') && (() => {
            const members = state.teamMembersBySignature[group.signature] || [];
            const event = group.events[0];
            const teamConfig = event ? getTeamSizeConfig(event.title) : null;
            const canAddMore = !teamConfig || members.length < (teamConfig.max - 1);
            const currentTeamSize = members.length + 1;
            const meetsMinimum = !teamConfig || currentTeamSize >= teamConfig.min;

            return (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-cyan-200">Team Members</h4>
                  <button
                    type="button"
                    onClick={() => addTeamMember(group.signature)}
                    disabled={!canAddMore}
                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/15 disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-500 rounded-lg transition-all border border-white/20"
                  >
                    + Add Team Member
                  </button>
                </div>

                {teamConfig && (
                  <div className={`p-3 rounded-lg mb-4 ${meetsMinimum ? 'bg-green-500/10 border border-green-400/30' : 'bg-red-500/10 border border-red-400/30'}`}>
                    <p className="text-sm font-medium mb-1">
                      Team size requirement: {teamConfig.min}{teamConfig.min !== teamConfig.max ? ` - ${teamConfig.max}` : ''} members
                    </p>
                    <p className="text-sm">
                      Current: <span className={meetsMinimum ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{currentTeamSize}</span> (including leader)
                    </p>
                    {!meetsMinimum && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                        <span>⚠️</span>
                        You need to add {teamConfig.min - currentTeamSize} more team member(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Show team size error if exists */}
                {formErrors[group.signature]?.['teamSize'] && (
                  <div className="flex items-center gap-1 mb-4 text-red-400 text-sm animate-pulse bg-red-500/10 p-3 rounded-lg border border-red-400/30">
                    <span className="text-lg">⚠️</span>
                    <p>{formErrors[group.signature]['teamSize']}</p>
                  </div>
                )}

                {members.map((member, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-white">Team Member #{idx + 2}</h5>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(group.signature, idx)}
                        className="text-sm text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SOLO_FIELDS.map(field => {
                        const error = formErrors[group.signature]?.[`member_${idx}_${field.name}`];
                        const value = member[field.name] || '';
                        
                        // Render file input directly (not using FormFieldInput)
                        if (field.type === 'file') {
                          const uploadedFile = memberFilesBySignature[group.signature]?.[idx];
                          
                          return (
                            <div key={`member_${idx}_${field.name}`} className="flex flex-col">
                              <label className="text-sm font-medium mb-2 text-white/90">
                                {field.label}
                                {field.required && <span className="text-pink-400 ml-1">*</span>}
                              </label>
                              <input
                                type="file"
                                accept={field.accept || 'image/*'}
                                required={!!field.required}
                                id={`team-file-${group.signature}-${idx}-${field.name}`}
                                className={`block w-full px-4 py-2.5 glass border ${error ? 'border-pink-500' : 'border-white/20'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer cursor-pointer`}
                                onChange={e => {
                                  const file = e.target.files?.[0] || null;
                                  console.log('📤 DIRECT FILE INPUT CHANGE:', { 
                                    memberIndex: idx, 
                                    signature: group.signature, 
                                    file: file?.name,
                                    inputId: `team-file-${group.signature}-${idx}-${field.name}`
                                  });
                                  handleMemberFileChange(group.signature, idx, file);
                                  // Store filename for display
                                  const filename = file?.name || '';
                                  handleMemberFieldChange(group.signature, idx, field.name, filename);
                                }}
                              />
                              {value && (
                                <span className="text-xs text-green-400 mt-1">Selected: {value}</span>
                              )}
                              {error && (
                                <p className="text-xs text-pink-400 mt-1">{error}</p>
                              )}
                            </div>
                          );
                        }
                        
                        // Use FormFieldInput for non-file fields
                        return (
                          <FormFieldInput
                            key={`member_${idx}_${field.name}`}
                            field={field}
                            value={value}
                            onChange={(value: string) => handleMemberFieldChange(group.signature, idx, field.name, value)}
                            onFileChange={(file: File | null) => {}}
                            error={error}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      ))}

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 rounded-lg transition-all font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
