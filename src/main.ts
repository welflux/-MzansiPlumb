if(location.pathname.startsWith('/app')||location.pathname.startsWith('/approve/')){
 void import('./operations');
}else{
 void import('./landing');
}
