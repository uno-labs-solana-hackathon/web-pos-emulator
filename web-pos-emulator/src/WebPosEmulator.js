import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-integer-field';
import '@vaadin/vaadin-item';
import '@vaadin/vaadin-dialog';
import './components/wpe-customer/wpe-customer.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { ARTICLES } from './articles.js';

export class WebPosEmulator extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      addedGoods: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: 1em;
        color: #1a2b42;
        max-width: 70%;
        margin: 0 auto;
        text-align: left;
        background-color: var(--web-pos-emulator-background-color);
      }

      main {
        flex-grow: 1;
      }

      vaadin-combo-box {
        width: 50%;
      }

      #resultDialog {
        width: 70%;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'Web POS emulator';
    this.allGoods = ARTICLES;
    this.mapAllGoods = {};
    this.allGoods.forEach(good => {
      this.mapAllGoods[good.id] = good;
    });
    this.addedGoods = [];
    registerStyles(
      'vaadin-dialog-overlay',
      css`
        [part="backdrop"] {
          /* background: rgba(237, 237, 237, 1); */
          background: #edededff;
        }
        [part="overlay"] {
          max-width: 70%;
        }
      `
    );
  }

  /**
   * The lifecycle method of any web component.
   * You can request data from data provider here.
   * @override
   */
  // connectedCallback() {
  //   super.connectedCallback();
  //
  //   /* if (!this.allGoods) {
  //        this._fetchAllGoods();
  //   } */
  // }

  /**
   * The lifecycle method of the LitElement.
   * Rerenders DOM if any property changes.
   * @implements {LitElement.render}
   * @returns {TemplateResult} Usually returns result of the tag function html`literal`.
   */
  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <vaadin-combo-box
          id="articleComboBox"
          clear-button-visible
          label="Article Number or Name"
          placeholder="Type for search..."
          .items="${this.allGoods}"
          .itemValuePath="${`id`}"
          .itemLabelPath="${`description`}"
        ></vaadin-combo-box>

        <vaadin-button id="addBtn" @click="${this._addButtonClick}">
          Add
        </vaadin-button>

        <vaadin-grid id="myTable" theme="compact wrap-cell-content column-borders" .items="${this.addedGoods}">
          <vaadin-grid-column
            header="N"
            width="4em"
            .renderer="${(root, column, rowData) =>
              (root.textContent = this.addedGoods.length - rowData.index)}"
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Article"
            path="article"
            auto-width
            resizable
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Name"
            path="name"
            auto-width
            resizable
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Price (unit)"
            .renderer="${(root, column, rowData) =>
              (root.textContent = rowData.item.price / 100)}"
            resizable
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Quantity"
            path="quantity"
            auto-width
            .renderer="${(root, column, rowData) =>
              this._quantityColumnRenderer(root, column, rowData)}"
            resizable
          ></vaadin-grid-column>
          <vaadin-grid-column
            header="Total"
            resizable
            .renderer="${(root, column, rowData) =>
              (root.textContent = rowData.item.price * rowData.item.quantity / 100)}"
          ></vaadin-grid-column>
          <vaadin-grid-column
            .renderer="${(root, column, rowData) =>
              this._deleteColumnRenderer(root, column, rowData)}"
            width="4em"
          ></vaadin-grid-column>
        </vaadin-grid>
        <div style="text-align: right;">
          <vaadin-item>
            <em>Total: </em><b>${this.addedGoods.map(good => good.price * good.quantity).reduce((x, y) => x + y, 0) / 100}</b>
          </vaadin-item>
          <vaadin-button
            theme="primary"
            ?disabled=${!this.addedGoods.length}
            @click="${ () => { this.shadowRoot.querySelector('#resultDialog').opened = true; } }"
          >Next</vaadin-button>
        </div>
        <vaadin-dialog
          id="resultDialog"
          no-close-on-outside-click
          .renderer="${(root, dialog) => { this._resultRenderer(root, dialog) }}"
          ></vaadin-dialog>
      </main>
    `;
  }

  /**
   * Listener function on "Add" button
   */
  _addButtonClick() {
    const articleComboBox = this.shadowRoot.querySelector('#articleComboBox');
    const grid = this.shadowRoot.querySelector('#myTable');
    if (articleComboBox.value) {
      const id = articleComboBox.value;
      // find if already been added; otherwise return undefined
      let addingGood = this._findAddedGoodById(id);
      if (addingGood) {
        addingGood.quantity = parseInt(addingGood.quantity, 10) + 1;
        this.addedGoods = [...this.addedGoods];
      } else {
        addingGood = {
          id,
          article: this.mapAllGoods[id].article,
          name: this.mapAllGoods[id].name,
          price: this.mapAllGoods[id].price,
          quantity: 1,
          // total: // auto calculation in the grid render()
        };
        this.addedGoods = [addingGood, ...this.addedGoods];
        grid.scrollToIndex(0);
      }
      articleComboBox.value = '';
    }
  }

  /**
   * Find and return article by id if it's in the added list
   * @param {Number} id
   * @returns {Object} - found article OR undefined
   */
  _findAddedGoodById(id) {
    let foundGood;
    this.addedGoods.forEach(good => { if (good.id === id) foundGood = good; });
    return foundGood;
  }

  /**
   * Renderer function for "Delete" <vaadin-grid-column>
   * @param {Object} root     - parent DOM element of cell
   * @param {Object} column   - column object
   * @param {Object} rowData  - row object
   */
  _deleteColumnRenderer(root, column, rowData) {
    let wrapper = root.firstElementChild;
    if (!wrapper) {
      root.innerHTML = `
          <div style="text-align: right">
            <vaadin-button aria-label="Delete" theme="icon error">
              <iron-icon icon="vaadin:close"></iron-icon>
            </vaadin-button>
          </div>`;
      wrapper = root.firstElementChild;

      const buttons = wrapper.querySelectorAll('vaadin-button');
      // DELETE
      buttons[0].addEventListener('click', () => {
        this.addedGoods = this.addedGoods.filter(good => good !== wrapper.itemx);
      });
    }
    // We reuse rendered content, but maintain a property with the index for actions
    wrapper.itemx = rowData.item;
  }

  /**
   * Renderer function for "Quantity" <vaadin-grid-column>
   * @param {Object} root     - parent DOM element of cell
   * @param {Object} column   - column object
   * @param {Object} rowData  - row object
   */
  _quantityColumnRenderer(root, column, rowData) {
    let quantityField = root.firstElementChild;
    if (!quantityField) {
      root.innerHTML = `
        <vaadin-integer-field value="1" min="1" has-controls></vaadin-number-field>
        `;
      quantityField = root.firstElementChild;
      // Add listener
      quantityField.addEventListener('change', () => {
        if (quantityField.value < 1) { quantityField.value = 1; }
        const updatedItem = {
          ...quantityField.itemx,
          quantity: parseInt(quantityField.value, 10),
          // total: // auto calculation in the grid render
        };
        this.addedGoods = this.addedGoods.map(good => good === quantityField.itemx ? updatedItem : good);
      });
    }
    quantityField.value = rowData.item.quantity;
    // We reuse rendered content, but maintain a property with the index for actions
    quantityField.itemx = rowData.item;
  }

  /**
   * Make report object with total and articles list
   */
  _makeReport() {
    const report = {
      total: this.addedGoods.map(good => good.price * good.quantity).reduce((x, y) => x + y, 0),
      goods: []
    };
    report.goods = [...this.addedGoods];
    report.goods.forEach(good => { good.total = good.price * good.quantity });
    return report;
  }

  /**
   * Renderer function for <vaadin-dialog> that consists "Buyer's info and bonuses" form
   * @param {Object} root     - HTML parent of <vaadin-dialog> content
   * @param {Object} dialog   - <vaadin-dialog> object
   */
  _resultRenderer(root, dialog) {
    // Check if there is a DOM generated with the previous renderer call to update its content instead of recreation
    if (!root.firstElementChild) {
      const myHeader = document.createElement('h3');
      myHeader.textContent = "Buyer's bonuses";
      const customerForm = document.createElement('wpe-customer');
      customerForm.id = 'customerForm';
      customerForm.addEventListener('cancel', () => { dialog.opened = false });
      customerForm.addEventListener('finish', () => { dialog.opened = false; this.addedGoods = []; });
      root.appendChild(myHeader);
      root.appendChild(customerForm);
    }
    root.querySelector('#customerForm').articles = this._makeReport();
  }
}
