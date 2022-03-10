import Featchscore from './Featchscore.js';

class Application {
  constructor() {
    this.inputs = document.querySelectorAll('.userdetails');
    this.success_message = document.querySelector('.success-message');
    this.form = document.querySelector('.data-form');
    this.tableList = document.querySelector('.table-content');
    this.refreshBtn = document.querySelector('.f5');
    this.resetBtn = document.querySelector('.f4');
    this.localStorageStringInstance = 'app_config';

    this.gateWay = new Featchscore();
    if (this.onLoad() != null) {
      this.gateWay.id = this.onLoad();
      this.refreshList();
    } else {
      this.createNewToken();
    }
  }

    initApp = () => {
      this.form.addEventListener('submit', (event) => {
        const refInstance = event.currentTarget.ref;
        refInstance.addUserScore();
        event.preventDefault();
      });
      this.form.ref = this;

      this.refreshBtn.addEventListener('click', (event) => {
        event.currentTarget.ref.refreshList();
      });
      this.refreshBtn.ref = this;

      this.resetBtn.addEventListener('click', (event) => {
        event.currentTarget.ref.createNewToken();
      });
      this.resetBtn.ref = this;
    }

    createNewToken = () => {
      const res = this.gateWay.getID('Seed');
      res.then((data) => {
        const stringResult = data.result;
        this.gateWay.id = stringResult.substring(13, 34);
        this.onSave(this.gateWay.id);
        this.refreshList();
      })
        .catch((error) => {
          throw error;
        });
    }

    addUserScore = () => {
      const res = this.gateWay.insertData(this.inputs[0].value, this.inputs[1].value);
      res.then((data) => {
        this.success_message.innerHTML = data.result;

        this.inputs[0].value = '';
        this.inputs[1].value = '';

        this.refreshList();

        const ref = this;
        setTimeout(() => { ref.success_message.innerHTML = ''; }, 1800, ref);
      })
        .catch((error) => {
          throw error;
        });
    }

    refreshList = () => {
      const res = this.gateWay.fetchData();
      res.then((data) => {
        let domContent = '';
        const users = data.result;
        users.forEach((user) => {
          domContent = `${domContent}<tr class="animate__animated animate__bounceInLeft">
          <td>${user.user}</td>
          <td class="text-dark">${user.score}</td>
          </tr>`;
        });
        this.tableList.innerHTML = domContent;
      })
        .catch((error) => {
          throw error;
        });
    }

    onSave = (token) => {
      localStorage.setItem(this.localStorageStringInstance, token);
    }

    onLoad = () => localStorage.getItem(this.localStorageStringInstance);
}

export default Application;