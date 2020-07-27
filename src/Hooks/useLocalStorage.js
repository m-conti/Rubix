function useLocalStorage(key, initialValue) {
  const [ storedValue, setStoredValue ] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    }
    catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
    }
    catch (error) {
      console.log(error);
    }
  };
  return [ storedValue, setValue ];
}

export default useLocalStorage;
