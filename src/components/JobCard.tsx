import { Camera, ImageIcon, TrendingUp } from 'lucide-react';
import { Job } from '../App';

type JobCardProps = {
  job: Job;
  mediaCount: number;
  onOpenCamera: (job: Job) => void;
  onViewProgress: (job: Job) => void;
  onViewCollections: (job: Job) => void;
};

export function JobCard({ job, mediaCount, onOpenCamera, onViewProgress, onViewCollections }: JobCardProps) {
  const needsPhotoToday = mediaCount === 0; // Simplified check

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[#4F6A41]">{job.clientName}</h3>
            <p className="text-gray-600 text-sm mt-0.5">{job.jobName}</p>
            <p className="text-gray-500 text-sm mt-1">{job.address}</p>
          </div>
          <span className="px-2 py-1 bg-[#4F6A41]/10 text-[#4F6A41] text-xs rounded-full">
            {job.jobType}
          </span>
        </div>
      </div>

      {/* Photo Reminder Banner */}
      {needsPhotoToday && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <p className="text-sm text-amber-900">
            📸 Daily progress photo required for {job.clientName}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 grid grid-cols-3 gap-2">
        {/* Camera Button - Primary Action */}
        <button
          onClick={() => onOpenCamera(job)}
          className="col-span-3 bg-[#3B9CAA] hover:bg-[#3B9CAA]/90 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Camera className="w-5 h-5" />
          <span>Open Camera</span>
        </button>

        {/* Secondary Actions */}
        <button
          onClick={() => onViewCollections(job)}
          className="bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center gap-1 text-sm"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs">{mediaCount} Media</span>
        </button>

        <button
          onClick={() => onViewProgress(job)}
          className="bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center gap-1 text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">Progress</span>
        </button>

        <div className="bg-gray-50 rounded-lg px-3 py-2 flex flex-col items-center justify-center gap-1 text-sm">
          <span className="text-xs text-gray-500">Assigned</span>
          <span className="text-xs">{job.assignedEmployees.length}</span>
        </div>
      </div>
    </div>
  );
}
