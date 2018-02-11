export class AppUtils {

  public static filterArrayByString(mainArr, searchText) {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr ? mainArr.filter(itemObj => {
      return this.searchInObj(itemObj, searchText);
    }) : [];
  }

  public static searchInObj(itemObj, searchText) {

    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

      if (typeof value === 'string') {
        if (this.searchInSting(value, searchText)) {
          return true;
        }
      }

      else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }

      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  public static searchInArray(arr, searchText) {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInSting(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
  }

  public static searchInSting(value, searchText) {
    return value.toLowerCase().includes(searchText);
  }

  public static generateGUID() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    }

    return (S4() + S4());
  }

  goToFragment(directiveScroll, fragment) {
    const element = document.getElementById(fragment);
    directiveScroll.scrollToY(element.offsetTop, 500);
  }
}
