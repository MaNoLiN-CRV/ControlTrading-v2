import { useRef, useEffect, useCallback } from "react";

const useEventCallback = (fn: Function) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args : any) => ref.current(...args), []);
}
export default useEventCallback;