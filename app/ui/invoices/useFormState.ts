import { useReducer } from 'react';

interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

type Action = 
  | { type: 'setError'; errors: Record<string, string[]> }
  | { type: 'setMessage'; message: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setError':
      return { ...state, errors: action.errors };
    case 'setMessage':
      return { ...state, message: action.message };
    default:
      return state;
  }
};

export const useFormState = (
  dispatchFunction: (formData: FormData) => Promise<void>, 
  initialState: State
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await dispatchFunction(formData);
  };

  return [state, handleSubmit] as const;
};
