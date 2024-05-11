import { CardState } from './features/cards/state';
import { SetState } from './features/sets/state';

interface AppState {
  cardState: CardState;
  setState: SetState;
}

export default AppState;
