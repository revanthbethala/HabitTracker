import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { CheckInStatus } from '@/types/habit';

const checkInSchema = z.object({
  status: z.enum(['DONE', 'PARTIAL', 'SKIPPED']),
  value: z.number().optional().or(z.literal('')),
  note: z.string().optional(),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: CheckInStatus; value?: number; note?: string }) => Promise<void>;
  initialData?: {
    status?: CheckInStatus;
    value?: number;
    note?: string;
  };
  isCountType: boolean;
  targetValue?: number;
  unit?: string;
  dateStr: string;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isCountType,
  targetValue,
  unit,
  dateStr,
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      status: initialData?.status || 'DONE',
      value: initialData?.value || '',
      note: initialData?.note || '',
    },
  });

  // Reset form when modal opens with new initialData
  useEffect(() => {
    if (isOpen) {
      reset({
        status: initialData?.status || 'DONE',
        value: initialData?.value || '',
        note: initialData?.note || '',
      });
    }
  }, [isOpen, initialData, reset]);

  const currentStatus = watch('status');

  const handleFormSubmit = async (data: CheckInFormValues) => {
    const val = data.value === '' || data.value === undefined ? undefined : Number(data.value);
    await onSubmit({
      status: data.status,
      value: val,
      note: data.note,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--bg)] rounded-xl shadow-2xl border border-[var(--border)] w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="text-lg font-bold font-heading text-[var(--text-h)]">
              Check-In for {dateStr}
            </h3>
            <button onClick={onClose} className="p-1 text-[var(--text)] hover:text-[var(--text-h)] transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
            
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">Status</label>
              <div className="flex gap-2">
                {['DONE', 'PARTIAL', 'SKIPPED'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setValue('status', s as CheckInStatus)}
                    className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md border transition-all ${
                      currentStatus === s
                        ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--code-bg)] text-[var(--text)] hover:bg-[var(--border)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Value Input (if COUNT type) */}
            {isCountType && currentStatus !== 'SKIPPED' && (
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Value {targetValue && `(Target: ${targetValue} ${unit || ''})`}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. 5"
                    className="flex-1"
                    {...register('value', { valueAsNumber: true })}
                    error={errors.value?.message}
                  />
                  {unit && <span className="text-[var(--text)] font-medium">{unit}</span>}
                </div>
              </div>
            )}

            {/* Note Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">Note (Optional)</label>
              <textarea
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-h)] placeholder-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                placeholder="How did it go?"
                rows={3}
                {...register('note')}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Check-In
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
