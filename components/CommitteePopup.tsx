"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CommitteeData, TeamMember } from '@/lib/teamData';

interface CommitteePopupProps {
  committee: CommitteeData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Locks body scroll while mounted
const BodyScrollLock: React.FC = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, []);
  return null;
};

const CommitteePopup: React.FC<CommitteePopupProps> = ({ committee, isOpen, onClose }) => {
  if (!isOpen || !committee) return null;

  // Group members by role
  const groupedMembers = committee.members.reduce((acc: Record<string, TeamMember[]>, member: TeamMember) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Define role hierarchy for display order
  const roleOrder = ['OH', 'CORE', 'COORDINATOR', 'VOLUNTEER', 'VOLUNTEERS'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <BodyScrollLock />
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close popup"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {committee.committeeName}
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              Complete Committee Members ({committee.members.length} members)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {roleOrder.map((role) => {
              const members = groupedMembers[role];
              if (!members || members.length === 0) return null;

              return (
                <div key={role} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <h3 className="text-xl font-bold text-white px-4 py-2 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full border border-white/20">
                      {role === 'OH' ? 'Organizing Head' : 
                       role === 'CORE' ? 'Core' :
                       role === 'COORDINATOR' ? 'Coordinators' :
                       role === 'VOLUNTEER' || role === 'VOLUNTEERS' ? 'Volunteers' : role}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>

                  <div className={members.length <= 2 ? "flex flex-wrap justify-center gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                    {members.map((member: TeamMember, index: number) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
                      >
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white text-lg">
                            {member.name}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10">
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Total Members: <span className="text-white font-semibold">{committee.members.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteePopup;
