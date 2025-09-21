import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Star, Shield } from 'lucide-react';
import { CommitteeData, TeamMember } from '../lib/teamData';

interface CommitteePopupProps {
  committee: CommitteeData | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoleIcon = ({ role }: { role: string }) => {
  switch (role.toUpperCase()) {
    case 'CORE':
    case 'OH': // Organizing Head
      return <Star className="w-4 h-4 text-yellow-400" />;
    case 'COORDINATOR':
      return <Shield className="w-4 h-4 text-blue-400" />;
    case 'VOLUNTEER':
    case 'VOLUNTEERS': // Handle plural form from data
      return <User className="w-4 h-4 text-green-400" />;
    default:
      return <User className="w-4 h-4 text-gray-400" />;
  }
};

const getDisplayRole = (role: string) => {
  const upperRole = role.toUpperCase();
  if (upperRole.startsWith('VOLUNTEER')) return 'VOLUNTEERS';
  if (upperRole === 'OH') return 'ORGANIZING HEAD';
  return `${upperRole}S`;
};

const CommitteePopup: React.FC<CommitteePopupProps> = ({ committee, isOpen, onClose }) => {
  if (!committee) return null;

  const roleOrder = ['OH', 'CORE', 'COORDINATOR', 'VOLUNTEER', 'VOLUNTEERS'];
  
  const groupedMembers = roleOrder
    .map(role => ({
      role,
      members: committee.members.filter(m => m.role.toUpperCase() === role)
    }))
    .filter(group => group.members.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900/70 border border-white/20 rounded-2xl shadow-2xl flex flex-col"
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
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Members List */}
            <div className="p-6 overflow-y-auto">
              <div className="space-y-8">
                {groupedMembers.map(({ role, members }) => (
                  <motion.div 
                    key={role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-purple-400 mb-4 tracking-widest uppercase border-b-2 border-purple-400/30 pb-2">
                      {getDisplayRole(role)} ({members.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex-shrink-0 bg-black/30 p-2 rounded-full">
                            <RoleIcon role={member.role} />
                          </div>
                          <div>
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-xs text-gray-400">Batch: {member.batch}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommitteePopup;