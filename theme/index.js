import { Colors, DefaultTheme } from 'react-native-paper';
// import * as DefaultTheme from 'react-native-paper';


export default class Theme {

  static PRIMARY_COLOR = Colors.cyan900;
  static PRIMARY_COLOR_DARK = Colors.teal50;
  static PRIMARY_COLOR_LIGHT = Colors.cyan500;
  static PRIMARY_BACKGROUND_COLOR = `rgba(${Number(0xe0)}, ${Number(0xf2)}, ${Number(0xf1)}, 1)`;

  static ACTIVE_DRAWER_BACKGROUND_COLOR = `rgba(${Number(0xad)}, ${Number(0x46)}, ${Number(0x2a)}, 0.24)`;

  static SECONDARY_COLOR = "#e09585";
  static SECONDARY_COLOR_DARK = "#ad462a";
  // static SECONDARY_COLOR_LIGHT = "#8b6b61";

  static HEADER_COLOR = "#000";
  static SUBTITLE_COLOR = "#333";
  static PARAGRAPH_COLOR = "#fff";
  static COMMENT_COLOR = "#777"

  static GRAY = "#f3f3f3"
  static WHITE = "#ffffff"

  static HEADER_WEIGHT = "700";
  static SUBTITLE_WEIGHT = "500";
  static NORMAL_WEIGHT = "300";
  static LIGHT_WEIGHT = "200";

  static TEXT_INPUT_THEME = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      underlineColor: Theme.SECONDARY_COLOR_DARK,
      background: Colors.white,
      primary: Theme.PRIMARY_COLOR,
      accent: Theme.SECONDARY_COLOR_DARK,
    },
  };

}
