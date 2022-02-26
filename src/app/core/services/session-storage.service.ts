import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  /**
   * Gets a data that has the specified key as its identifier.
   * @param key The key used as the data identifier.
   * @returns The data (an object converted from JSON) or null, if no data with the specified key 
   * exists.
   */
  getData(key: string): any {
    if (!this.doesTheKeyHaveRegisteredData(key)) {
      return null;
    }

    try {
      const json = sessionStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    }
    catch {
      return null;
    }
  }
  
  private doesTheKeyHaveRegisteredData(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }

  /**
   * Saves the specified data in the SessionStorage using the specified key as an identifier.
   * @param key The key to be used as the data identifier.
   * @param data The data to save (an object that will be converted to JSON).
   * @returns Whether the save operation was successful.
   */
  saveData(key: string, data: any): boolean {
    try {
      if (this.doesTheKeyHaveRegisteredData(key)) {
        this.deleteData(key);
      }
      sessionStorage.setItem(key, JSON.stringify(data));
      return true;
    }
    catch {
      return false;
    }
  }

  /**
   * Gets a data that has the specified key as its identifier.
   * @param key The key used as the data identifier.
   * @returns The data (an object converted from JSON) or null, if no data with the specified key 
   * exists.
   */
  deleteData(key: string): boolean {
    if (!this.doesTheKeyHaveRegisteredData(key)) {
      return true;
    }

    try {
      sessionStorage.removeItem(key);
      return true;
    }
    catch {
      return false;
    }
  }
}
