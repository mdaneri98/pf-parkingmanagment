import { useMemo } from 'react';
import { useGetRemainingTimeQuery } from '@walkinstays/api/walkInStayApi';
import { parseRemainingTimeText } from '@walkinstays/utils/walkInStayUtils';

interface UseGetRemainingTimeOptions {
  skip?: boolean;
  pollingInterval?: number;
}

/**
 * Hook to get and poll remaining time for a walk-in stay
 * Automatically parses the API text response to extract minutes
 */
export const useGetRemainingTime = (
  walkInStayId: number | undefined,
  options: UseGetRemainingTimeOptions = {}
): {
  remainingMinutes: number | undefined;
  remainingText: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
} => {
  const { skip = false, pollingInterval = 0 } = options;

  const {
    data: remainingText,
    isLoading,
    isError,
    error,
  } = useGetRemainingTimeQuery(
    walkInStayId!,
    {
      skip: skip || !walkInStayId,
      pollingInterval,
    }
  );

  const remainingMinutes = useMemo(() => {
    if (!remainingText) return undefined;
    return parseRemainingTimeText(remainingText);
  }, [remainingText]);

  return {
    remainingMinutes,
    remainingText,
    isLoading,
    isError,
    error,
  };
};

