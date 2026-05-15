import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '@/api/services/habits';
import { checkInService } from '@/api/services/metrics';
import type { HabitStatus, HabitRequest, CheckInRequest } from '@/types/habit';

export const useHabits = (status?: HabitStatus, sort?: string) => {
  return useQuery({
    queryKey: ['habits', { status, sort }],
    queryFn: () => habitService.getAll(status, sort),
  });
};

export const useHabit = (id: number) => {
  return useQuery({
    queryKey: ['habit', id],
    queryFn: () => habitService.getById(id),
    enabled: !!id,
  });
};

export const useHabitMutations = () => {
  const queryClient = useQueryClient();

  const createHabit = useMutation({
    mutationFn: (data: HabitRequest) => habitService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const updateHabit = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HabitRequest> }) => 
      habitService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', variables.id] });
    },
  });

  const deleteHabit = useMutation({
    mutationFn: (id: number) => habitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return { createHabit, updateHabit, deleteHabit };
};

export const useCheckInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, data }: { habitId: number; data: CheckInRequest }) => 
      checkInService.upsert(habitId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', variables.habitId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
