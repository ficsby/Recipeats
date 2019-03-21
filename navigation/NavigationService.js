import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function openDrawer(){
    _navigator.openDrawer();
}

function closeDrawer(){
    _navigator.closeDrawer();
}

export default {
    navigate, 
    setTopLevelNavigator,
    openDrawer,
    closeDrawer,
}