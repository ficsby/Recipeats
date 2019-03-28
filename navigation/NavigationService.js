import { NavigationActions } from 'react-navigation';

let _navigator;
let _homeNavigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getTopLevelNavigator(navigatorRef) {
    return _navigator;
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

function reset(routes){
    idx = routes.length;
    var navActions = _navigator.reset({
        index: idx,
        actions: routes
    })
    _navigator.dispatch(navActions), (error) => {
        Alert.alert(error.message);
    };
}

export default {
    navigate, 
    setTopLevelNavigator,
    getTopLevelNavigator,
    openDrawer,
    closeDrawer,
}