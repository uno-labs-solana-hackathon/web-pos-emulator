/**
 * Web-component class - Wrapper for Vaadin Form Layout module
 * @module app/components/WpeCustomer
 * @description Class for <wpe-customer> web-component
 */
import { LitElement, html, css } from 'lit-element';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-text-field/vaadin-integer-field';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-notification';
import { GLOBAL_PARAMS } from './config.js';

/**
 * Class for the <wpe-customer> web component
 * @extends LitElement
 */
export class WpeCustomer extends LitElement {
  /**
   * Properties description - LitElement-properties
   * @static
   * @implements {LitElement.properties}
   * @property {Boolean} loading              - true if some data is loading over API
   * @property {Object} articles              - articles description of the current purchase
   * @property {Object} customer              - the Customer object. Got over combo-box select.
   * @property {number} payByBonuses          - bonuses amount that customer wish to spend (not used)
   * @property {string} tx                    - signed transaction (by customer) to spend ${payByBonuses} (not used)
   * @property {number} earnedBonuses         - bonuses amount that customer will earn after this purchase
   * @property {string} notificationHTML      - what display on notification prompt
   */
  static get properties() {
    return {
      loading: { type: Boolean },
      articles: { type: Object },
      customer: { type: Object },
      payByBonuses: { type: Number },
      tx: { type: String },
      earnedBonuses: { type: Number },
      notificationHTML: { type: String }
    };
  }

  /**
   * Setting initial values of properties and fields of the class
   * @override
   */
  constructor() {
    super();
    // Body templates to request API
    this.apiBodyTemplates = {
      find_client: {
        method: 'find_client',
        data: {
          client_id: '',
          is_create_if_not_found: true,
        },
      },
      make_buy_tx: {
        method: 'make_buy_tx',
        data: {
          client_id: '',
          spend: 0,
          spend_sign: '',
          items: [],
          commit: false
        },
      },
    };
  }

  /**
   * The lifecycle method of any web component.
   * You can request data from data provider here.
   * @override
   */
  // connectedCallback() {
  //   super.connectedCallback();
  // }

  /**
   * Styles of shadow root of the web component
   * @static
   * @implements {LitElement.styles}
   * @return {(object|Array)} Returns array of css`literal`
   */
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        /* align-items: center; */
        justify-content: center;
        /* font-size: calc(10px + 1vmin); */
        font-size: 16px;
        color: #1a2b42;
        /* background-color: lightgray; */
        max-width: 100%;
        margin: 0 auto;
        text-align: center;
      }

      main {
        flex-grow: 1;
      }

      hr {
        color: lightgrey;
        background-color: lightgray;
        height: 2px;
        border-width: 0;
        margin-top: 1em;
        margin-bottom: 1em;
      }
    `;
  }

  /**
   * The lifecycle method of the LitElement.
   * Rerenders DOM if any property changes.
   * @implements {LitElement.render}
   * @returns {TemplateResult} Usually returns result of the tag function html`literal`.
   */
  render() {
    return html`
      <main>
        <vaadin-notification
          duration="4000"
          id="notification"
          .renderer=${(root) => {root.innerHTML = this.notificationHTML}}
        >
        </vaadin-notification>
        <vaadin-form-layout .responsiveSteps="${[{"columns": 4}]}">
          <vaadin-text-field
            id="buyerId"
            label="Buyer's ID"
            clear-button-visible
            placeholder="Insert ID"
            colspan="2"
          ></vaadin-text-field>
          <vaadin-button
            id="acceptIdBtn"
            @click="${this._acceptButtonClick}"
            colspan="1"
          >Accept ID
          </vaadin-button>

          <vaadin-text-field
            label="Buyers's name"
            readonly
            value="${this.customer ? this.customer.name : ''}"
            colspan="1"
          ></vaadin-text-field>

          <vaadin-text-field
            label="Balance"
            readonly
            value="${this.customer ? this.customer.balance / 100 : ''}"
          ></vaadin-text-field>
          <vaadin-text-field
            label="Can spend"
            readonly
            value="${this.customer ? this.customer.can_spend / 100 : ''}"
          ></vaadin-text-field>

          <vaadin-text-field
            label="Total"
            readonly
            value="${this.articles ? this.articles.total / 100 : ''}"
          ></vaadin-text-field>
          <vaadin-text-field
            label="Earned bonuses"
            readonly
            value="${this.customer && this.earnedBonuses ? this.earnedBonuses / 100 : ''}"
          ></vaadin-text-field>

          <div></div><hr /><hr /><div></div>

          <div></div>
          <vaadin-number-field
            id="payByBonuses"
            label="Pay by bonuses"
            ?disabled="${!this.customer}"
            step="0.01"
            min="0"
            max="${this.customer && this.articles
              ? Math.min(this.customer.can_spend, this.articles.total) / 100
              : ''}"
            value="${this.customer && this.articles
              ? Math.min(this.customer.can_spend, this.articles.total) / 100
              : ''}"
            @change=${e => this._changePayByBonuses(e)}
          ></vaadin-number-field>
          <vaadin-text-field
            id="payByMoney"
            label="Pay by money"
            readonly
            value="${this.customer && this.articles
              ? (this.articles.total - Math.min(this.customer.can_spend, this.articles.total)) / 100
              : this?.articles?.total / 100}"
          ></vaadin-text-field>
          <div></div>

          <div></div><hr /><hr /><div></div>

          <!--  <vaadin-text-field
            id="txField"
            label="Signed customer transaction"
            colspan="2"
          ></vaadin-text-field> -->

          <vaadin-button
            id="cancelBtn"
            @click="${this._cancelButtonClick}"
          >Previous
          </vaadin-button>
          <div></div><div></div>
          <vaadin-button
            id="finishBtn"
            ?disabled=${this.loading}
            @click="${this._finishButtonClick}"
            theme="primary"
          >Finish
          </vaadin-button>

        </vaadin-form-layout>
      </main>
    `;
  }

  /**
   * Listener function on "Accept ID" button
   */
  async _acceptButtonClick() {
    const id = this.shadowRoot.querySelector('#buyerId').value;
    if (id) {
      this._findCustomerById(id);
    } else {
      this.customer = undefined;
    }
  }

  /**
   * Make API request with method "find_client".
   * Fill property ${this.customer} after API successful response.
   * @param {string} id - user id
   */
  async _findCustomerById(id) {
    // Reset current buyer
    this.customer = undefined;
    // Get Customer by ID over API
    const body = { ...this.apiBodyTemplates.find_client };
    body.data.client_id = id;
    console.log(`Find_client - Request body: ${  JSON.stringify(body)}`);
    // make API request with "find_client" method
    const customerInfo = await this._makeApiRequest(body);
    if (customerInfo) {
      this.customer = {
        id: customerInfo.id,
        name: customerInfo.name ? customerInfo.name : `ID: ${customerInfo.id}`,
        balance: customerInfo.balance.total,
        can_spend: customerInfo.balance.unlocked
      };
      // Request how much bonuses the buyer will get if buy this articles set
      this.earnedBonuses = await this._requestEarnedBonuses(this.customer, this.customer.can_spend);
    }
    else {
      // Here must be notification about some errors.
      this._notify("<div><b>Error! </b><br>Can not get Buyer's Info</div>");
    }
  }

  /**
   * Request how much bonuses buyer will get if buy this set of articles
   * @param {Object} customer - buyer object like ${this.customer} property
   * @param {Number} spend    - how much bonuses will be spent
   * @returns {Number} - earned bonuses
   */
  async _requestEarnedBonuses(customer, spend) {
    let earnedBonuses = '';

    // make TX API request with commit=false
    const txData = await this._requestTxApi(customer, spend, false);
    if (txData) {
      earnedBonuses = txData.earned;
    }
    else {
      // Here must be notification about some errors.
      this._notify("<div><b>Error! </b><br>Can not get Transaction Info</div>");
    }
    return earnedBonuses;
  }

  /**
   * Request to do transaction over API
   * @param {Object} customer   - buyer object like ${this.customer} property
   * @param {Number} spend      - how much bonuses will be spent
   * @param {Boolean} isCommit  - dummy transaction if it is false
   * @returns {Object}          - response data object. Undefined if there are errors
   */
  async _requestTxApi(customer, spend, isCommit) {
    let returnedData;
    const body = { ...this.apiBodyTemplates.make_buy_tx };
    body.data.client_id = customer?.id;
    body.data.spend = spend;
    body.data.commit = isCommit;
    body.data.items = this.articles.goods.map(article => ({...article, qty: article.quantity}));
    console.log(`Make_buy_tx (commit: ${isCommit}) - Request body: ${  JSON.stringify(body)}`);
    // make API request
    const txData = await this._makeApiRequest(body);
    if (txData) {
      returnedData = txData;
    }
    else {
      // Here must be notification about some errors.
      // this._notify("<div><b>Errors! </b><br>Can not accomplish this transation</div>");
      console.log('Transaction errors!');
    }
    return returnedData;
  }

  /**
   * Make AJAX request with fetch()
   * @param {Object} body - data for POST request
   * @returns {Object}    - the data part of API response OR undefined if some errors
   */
  async _makeApiRequest(body) {
    this.loading = true;
    let returnData; // initialize by undefined;
    try {
      const response = await fetch(GLOBAL_PARAMS.getCustomerUrlPost, {
        method: 'POST', // 'POST' или 'PUT'
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const responseJson = await response.json();
      if (responseJson?.result?.res === 'OK') { returnData = responseJson.data; }
      console.log('API response data: ', JSON.stringify(responseJson));
    } catch (error) {
      console.error('API Network Error Exception:', error);
      this._notify("<div><b>Error! </b><br>Some network errors</div>");
    }
    this.loading = false;
    return returnData;
  }

  /**
   * Listener function on "Pay by bonuses field"
   * @param {Object} e - event object
   */
  async _changePayByBonuses(e) {
    const payByMoney = this.shadowRoot.querySelector('#payByMoney');
    // if filed has invalid value, set max
    if (!e.target.validate()) {
      e.target.value =
        this.customer && this.articles
          ? Math.min(this.customer.can_spend, this.articles.total) / 100
          : '';
    }
    // Recalculate "Pay by Money" field
    payByMoney.value =
        this.customer && this.articles
          ? (this.articles.total - e.target.value * 100) / 100
          : '';
    // Request how much bonuses buyer will get if buy this set of articles
    this.earnedBonuses = await this._requestEarnedBonuses(this.customer, parseInt(e.target.value, 10));
  }

  /**
   * Listener function on "Finish" button
   */
  async _finishButtonClick() {
    // Check if it is requesting API
    if (this.loading) return;
    const payByBonusesValue = parseInt(this.shadowRoot.querySelector('#payByBonuses').value, 10);
    // make real TX API request with commit=true
    const txData = await this._requestTxApi(this.customer, payByBonusesValue, true);
    if (txData) {
      // Some do here in successful case
      const notificationContent = `
        <div style="margin: 0 auto;">
          <strong>Successful transaction!</strong><hr />
          Buyer ID: ${txData.client_id ? txData.client_id : ''}<br />
          Total: ${txData.total / 100}<br />
          Spent bonuses: ${txData.spend / 100}<br />
          Earned bonuses: ${txData.earned / 100}
        </div>`;
      this._notify(notificationContent, 'middle', 7000);
      // Generating an event "finish" (this dialog will be closed)
      this.dispatchEvent(
        new CustomEvent('finish', {
          detail: { message: 'Successful transaction.' },
        })
      );
    }
    else {
      // Here must be notification about some errors.
      this._notify("<b>Error</b><br>Can not accomplish this transation !");
      // Some do here in unsuccessful case
    }
  }

  /**
   *
   * @param {String} textHTML - HTML content to display with notification component
   * @param {String} position - position of notification component (<vaadin-notification>)
   * @param {Number} duration - how long to display the notification, in milliseconds
   */
  _notify(textHTML, position, duration) {
    this.notificationHTML = textHTML;
    const notification = this.shadowRoot.querySelector('#notification');
    if (position) notification.position = position;
    if (duration) notification.duration = duration;
    notification.open();
  }

  /**
   * Listenter function on "Previous" button.
   * This dialog will be closed.
   */
  _cancelButtonClick() {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        detail: { message: 'Customer dialog canceled.' },
      })
    );
  }
}
