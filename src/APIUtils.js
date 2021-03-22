export class APIUtils {

  static URL = "https://mata-api.herokuapp.com";
  //static URL = "http://localhost:3033";

  static async getInitStockData() {
    const response = await fetch(`${this.URL}/treasure/getData`);
    return response.json();
  }

  static async getStockData(code) {
    const response = await fetch(`${this.URL}/treasure?code=${code}`);
    return response.json();
  }

  static async updateStock(data) {
    const response = await fetch(`${this.URL}/treasure/updateData`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async deleteStock(data) {
    const response = await fetch(`${this.URL}/treasure/deleteData`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: data
    });
    return response.json();
  }

  static async addStock(data) {
    const response = await fetch(`${this.URL}/treasure/addData`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}