export default function(s, a) {
  let sw = "99comic.com|99manga.com";
  let su = 'www.99comic.com';
  let b = false;
  for(let i = 0; i < sw.split("|").length; i++) {
    if(su.indexOf(sw.split("|")[i]) > -1) {
      b = true;
      break
    }
  }
  if(!b) return"";
  let k = a.substring(0, a.length - 1);
  let f = a.substring(a.length - 1);
  for(let i = 0;i < k.length; i++) {
    eval("s=s.replace(/" + k.substring(i, i + 1) + "/g,'" + i +"')")
  }
  let ss = s.split(f);
  s = "";
  for(let i = 0; i < ss.length; i++) {
    s += String.fromCharCode(ss[i])
  }
  return s
}
