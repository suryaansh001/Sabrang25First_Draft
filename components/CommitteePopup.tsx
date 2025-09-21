"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Star, Shield, Crown } from 'lucide-react';
import { CommitteeData, TeamMember } from '../src/lib/teamData';

interface CommitteePopupProps {
  committee: CommitteeData | null;
  isOpen: boolean;
  onClose: () => void;
}

const renderSection = (title: string, members: TeamMember[], children: React.ReactNode) => {
  if (members.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-purple-400 tracking-widest uppercase border-b-2 border-purple-400/30 pb-2">
        {title} ({members.length})
      </h3>
      {children}
    </motion.div>
  );
};

const CommitteePopup: React.FC<CommitteePopupProps> = ({ committee, isOpen, onClose }) => {
  if (!committee) return null;

  // Group members by role for hierarchical display
  const ohMembers = committee.members.filter(m => m.role.toUpperCase() === 'OH');
  const coreMembers = committee.members.filter(m => m.role.toUpperCase() === 'CORE');
  const coordinatorMembers = committee.members.filter(m => m.role.toUpperCase() === 'COORDINATOR');
  const volunteerMembers = committee.members.filter(m => m.role.toUpperCase().startsWith('VOLUNTEER'));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900/80 border border-white/20 rounded-2xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase">
                  {committee.committeeName}
                </h2>
                <p className="text-sm text-gray-400">{committee.members.length} Members</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center group"
                aria-label="Close"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Members List with Hierarchy */}
            <div className="p-6 overflow-y-auto space-y-10">
              
              {/* Organizing Head */}
              {renderSection('Organizing Head', ohMembers, (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ohMembers.map((member, index) => (
                    <div key={index} className="bg-gradient-to-br from-yellow-500/20 to-neutral-900/10 p-4 rounded-xl border-2 border-yellow-400/50 shadow-lg flex items-center gap-4">
                      <div className="flex-shrink-0 bg-yellow-400/20 p-3 rounded-full border border-yellow-400/50">
                        <Crown className="w-6 h-6 text-yellow-300" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{member.name}</p>
                        <p className="text-sm text-yellow-300">Batch: {member.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Core Members */}
              {renderSection('Core Members', coreMembers, (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreMembers.map((member, index) => (
                    <div key={index} className="bg-neutral-800/50 p-4 rounded-lg border border-white/20 flex items-center gap-4 hover:bg-neutral-800/80 transition-colors">
                      <div className="flex-shrink-0 bg-purple-500/20 p-2 rounded-full border border-purple-400/50">
                        <Star className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-gray-400">Batch: {member.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Coordinators */}
              {renderSection('Coordinators', coordinatorMembers, (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coordinatorMembers.map((member, index) => (
                    <div key={index} className="bg-neutral-800/30 p-3 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-neutral-800/50 transition-colors">
                      <div className="flex-shrink-0 bg-blue-500/20 p-2 rounded-full">
                        <Shield className="w-4 h-4 text-blue-300" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-xs text-gray-400">Batch: {member.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Volunteers */}
              {renderSection('Volunteers', volunteerMembers, (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
                  {volunteerMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 py-1.5 break-inside-avoid">
                      <User className="w-3.5 h-3.5 text-green-400/70 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{member.name}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommitteePopup;
