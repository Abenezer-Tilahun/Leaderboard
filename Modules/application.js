import Featchscore from './Featchscore.js';

class Application {
  constructor() {
    this.gateWay = new Featchscore();
    this.gateWay.getID('Seed');

    this.inputs = document.querySelectorAll('.userdetails');
    this.success_message = document.querySelector('.success-message');
    this.form = document.querySelector('.data-form');
    this.tableList = document.querySelector('.table-content');
    this.refreshBtn = document.querySelector('.f5');
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
}

export default Application;