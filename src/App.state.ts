import { MainPageState } from './features/main-page/state';
import { SetState } from './features/sets/state';

interface AppState {
  mainPage: MainPageState;
  set: SetState;
}

export default AppState;
