import { useCallback, useEffect, useRef } from "react";

// This hook is used to prevent memory leaks when the component is unmounted
const useSafeDispatch = <T>(dispatch: React.Dispatch<T>) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(
    (arg: T) => {
      if (mounted.current) {
        dispatch(arg);
      }
    },
    [dispatch]
  );
}

export default useSafeDispatch;