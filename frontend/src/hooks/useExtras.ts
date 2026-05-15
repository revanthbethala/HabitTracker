import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exceptionService, reminderService } from '@/api/services/extras';
import { checkInService } from '@/api/services/metrics';

export const useExceptions = (habitId: number) => {
  return useQuery({
    queryKey: ['exceptions', habitId],
    queryFn: () => exceptionService.getAll(habitId),
    enabled: !!habitId,
  });
};

export const useExceptionMutations = (habitId: number) => {
  const queryClient = useQueryClient();

  const addException = useMutation({
    mutationFn: (data: { exceptionDate: string; reason?: string }) => 
      exceptionService.create(habitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const removeException = useMutation({
    mutationFn: (exceptionId: number) => exceptionService.delete(exceptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return { addException, removeException };
};

export const useReminder = (habitId: number) => {
  return useQuery({
    queryKey: ['reminder', habitId],
    queryFn: () => reminderService.get(habitId),
    enabled: !!habitId,
    retry: false, // Might return 404 if no reminder exists
  });
};

export const useReminderMutations = (habitId: number) => {
  const queryClient = useQueryClient();

  const setReminder = useMutation({
    mutationFn: (data: { reminderTime: string; isEnabled: boolean }) => 
      reminderService.upsert(habitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder', habitId] });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: () => reminderService.delete(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder', habitId] });
    },
  });

  return { setReminder, deleteReminder };
};

export const useCheckInHistory = (habitId: number) => {
  return useQuery({
    queryKey: ['checkin-history', habitId],
    queryFn: () => checkInService.getHistory(habitId),
    enabled: !!habitId,
  });
};
