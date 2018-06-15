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

  public static removeAccents(value) {
    return value && value
      .replace(/á/g, 'a')
      .replace(/à/g, 'a')
      .replace(/é/g, 'e')
      .replace(/è/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ì/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ò/g, 'o')
      .replace(/ù/g, 'u')
      .replace(/ú/g, 'u');
  }

  public static filterObject(object: any): any {
    return { runnerName: object.runnerName, dorsal: object.dorsal };
  }

  public static filterPredicate(data, filter) {
    // Transform the data into a lowercase string of all property values.
    const accumulator = (currentTerm, key) => currentTerm + data[key];
    const dataStr = this.removeAccents(Object.keys(data).reduce(accumulator, '').toLowerCase());

    // Transform the filter by converting it to lowercase and removing whitespace.
    filter = typeof filter === 'string' ? filter : filter.runnerName;
    const transformedFilter = this.removeAccents(filter.trim().toLowerCase());

    return dataStr.indexOf(transformedFilter) !== -1;
  }

  goToFragment(directiveScroll, fragment) {
    const element = document.getElementById(fragment);
    directiveScroll.scrollToY(element.offsetTop, 500);
  }
}
