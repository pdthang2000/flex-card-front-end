import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

export function forwardTo(path: string) {
  navigate(path);
}
export default navigate;
