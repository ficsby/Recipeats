import { NavigationActions } from 'react-navigation';

let _navigator;
let _homeNavigator;
let _modalVisibility = false;
let _searchSensitivity = true;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getTopLevelNavigator(navigatorRef) {
    return _navigator;
}

function setModalVisibility(vis) {
  _modalVisibility = vis;
}

function getModalVisibility(){
  return _modalVisibility;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function goBack(){
  _navigator.goBack(null);
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
    goBack, 
    setTopLevelNavigator,
    getTopLevelNavigator,
    openDrawer,
    closeDrawer,
    setModalVisibility,
    getModalVisibility,
    _modalVisibility,
}