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
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-icons';
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
   * @property {Boolean} isInputValid         - is some input value valid (to enable "Finish" button)
   * @property {Boolean} loading              - true if some data is loading over API
   * @property {Object} articles              - articles description of the current purchase
   * @property {Object} customer              - (ReadOnly) the Customer object {id, name, balance, can_spend, is_on_chain}.
   * @property {Object} txInfo                - (ReadOnly) the Transaction object {total, earned, spend, spend_sign, spend_raw_tx, new_account_raw_tx}
   * @property {string} newAccountTxSigned    - the signed transaction string signed by buyer on creating account on blockchain
   * @property {string} txSigned              - the signed transaction string signed by buyer on spending bonuses
   * @property {number} payByBonuses          - bonuses amount that customer wish to spend
   * @property {string} notificationHTML      - what display on notification prompt
   */
  static get properties() {
    return {
      isInputValid: { type: Boolean },
      loading: { type: Boolean },
      articles: { type: Object },
      customer: { type: Object },
      txInfo: { type: Object },
      newAccountTxSigned: { type: String},
      txSigned: { type: String },
      payByBonuses: { type: Number },
      notificationHTML: { type: String }
    };
  }

  /**
   * Setting initial values of properties and fields of the class
   * @override
   */
  constructor() {
    super();
    // Initial properties values
    this.isInputValid = true;
    this.payByBonuses = 0;
    this.txSigned = '';
    this.newAccountTxSigned = '';
    // Turn on logging
    if (window.location.hash === '#logging') this._isLogging = true;
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
          .renderer=${root => {
            root.innerHTML = this.notificationHTML;
          }}
        ></vaadin-notification>
        <vaadin-form-layout .responsiveSteps="${[{ columns: 4 }]}">
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
            label="Buyer's name"
            readonly
            .value="${this.customer ? this.customer.name : ''}"
            colspan="1"
          ></vaadin-text-field>

          <vaadin-text-field
            label="Total bonuses"
            readonly
            value="${this.customer ? this.customer.balance / 100 : ''}"
          ></vaadin-text-field>
          <vaadin-text-field
            label="Bonuses you can spend"
            readonly
            value="${this.customer ? this.customer.can_spend / 100 : ''}"
          ></vaadin-text-field>

          <vaadin-text-field
            label="Total price"
            readonly
            value="${this.articles.total / 100}"
          ><div slot="prefix">$</div>
          </vaadin-text-field>
          <vaadin-text-field
            label="Bonuses to be earned"
            readonly
            value="${this.customer && this.txInfo
              ? this.txInfo.earned / 100
              : ''}"
          ></vaadin-text-field>


          ${this.customer && this.txInfo && this.txInfo.new_account_raw_tx
            ? html`
                <vaadin-text-field
                  id="newAccountTxField"
                  label="Unsigned TX 'New Account'"
                  readonly
                  value="${this.customer && this.txInfo
                    ? this.txInfo.new_account_raw_tx
                    : ''}"
                  colspan="1"
                >
                  <div slot="suffix" title="Copy to Clipboard">
                    <iron-icon
                      icon="vaadin:copy-o"
                      @click="${() => { this._copyTxToClipboard('#newAccountTxField'); }}"
                    ></iron-icon>
                  </div>
                </vaadin-text-field>
              `
            : html`<div></div>`}

          <hr />
          <hr />

          ${this.customer && this.txInfo && this.txInfo.new_account_raw_tx
            ? html`
                <vaadin-text-field
                  id="newAccountTxSignedField"
                  label="Signed TX 'New Account'"
                  clear-button-visible
                  .value="${this.txInfo?.new_account_raw_tx ? this.newAccountTxSigned : ''}"
                  @input="${(e) => { this.newAccountTxSigned = e.target.value; }}"
                  colspan="1"
                ></vaadin-text-field>
              `
            : html`<div></div>`}


          ${this.customer && this.txInfo && this.txInfo.spend_raw_tx
            ? html`
                <vaadin-text-field
                  id="txField"
                  label="Unsigned transaction"
                  readonly
                  value="${this.customer && this.txInfo
                    ? this.txInfo.spend_raw_tx
                    : ''}"
                  colspan="1"
                >
                  <div slot="suffix" title="Copy to Clipboard">
                    <iron-icon
                      icon="vaadin:copy-o"
                      @click="${() => { this._copyTxToClipboard('#txField'); }}"
                    ></iron-icon>
                  </div>
                </vaadin-text-field>
              `
            : html`<div></div>`}

          <vaadin-number-field
            id="payByBonuses"
            label="Pay with bonuses"
            required
            ?disabled="${!(this.customer && this.txInfo)}"
            step="0.01"
            min="0"
            max="${this.customer && this.txInfo
              ? Math.min(this.customer.can_spend, this.articles.total) / 100
              : ''}"
            .value="${this.payByBonuses / 100}"
            @input=${e => this._changePayByBonuses(e)}
          ></vaadin-number-field>
          <vaadin-text-field
            id="payByMoney"
            label="Pay with money"
            readonly
            value="${this.customer && this.txInfo
              ? (this.articles.total - this.payByBonuses) / 100
              : this.articles.total / 100}"
          ><div slot="prefix">$</div>
          </vaadin-text-field>

          ${this.customer && this.txInfo && this.txInfo.spend_raw_tx
            ? html`
                <vaadin-text-field
                  id="txSignedField"
                  label="Signed transaction"
                  ?disabled="${this.payByBonuses === 0}"
                  clear-button-visible
                  .value="${this.txInfo?.spend_raw_tx ? this.txSigned : ''}"
                  @input="${(e) => { this.txSigned = e.target.value; }}"
                  colspan="1"
                ></vaadin-text-field>
              `
            : html`<div></div>`}

          <div></div>
          <hr />
          <hr />
          <div></div>

          <vaadin-button id="cancelBtn" @click="${this._cancelButtonClick}"
            >Previous
          </vaadin-button>
          <div></div>
          <div></div>
          <vaadin-button
            id="finishBtn"
            ?disabled=${this.loading  || (!this.isInputValid) || (this.payByBonuses > 0 && this.txInfo?.spend_raw_tx && (!this.txSigned))}
            @click="${this._finishButtonClick}"
            theme="primary"
            >Finish
          </vaadin-button>
        </vaadin-form-layout>
      </main>
    `;
  }

  /**
   * Clear all customer properties
   */
  _clearCustomer() {
    this.shadowRoot.querySelector('#payByBonuses').value = 0;
    this.isInputValid = true;
    this.customer = undefined;
    this.txInfo = undefined;
    this.payByBonuses = 0;
    this.txSigned = '';
    this.newAccountTxSigned = '';
  }

  /**
   * Listener function on "Accept ID" button
   */
  async _acceptButtonClick() {
    // Reset current buyer
    this._clearCustomer();
    const id = this.shadowRoot.querySelector('#buyerId').value;
    if (id) {
      this._findCustomerById(id);
    }
  }

  /**
   * Make API request with method "find_client".
   * Fill property ${this.customer} after API successful response.
   * @param {string} id - user id
   */
  async _findCustomerById(id) {
    // Get Customer by ID over API
    const body = { method: 'find_client', data: { is_create_if_not_found: true } };
    body.data.client_id = id;
    this._logging(`Find_client - Request body: ${JSON.stringify(body)}`);
    // make API request with "find_client" method
    const customerInfo = await this._makeApiRequest(body);
    if (customerInfo) {
      this.customer = {
        id: customerInfo.id,
        name: customerInfo.name ? customerInfo.name : `ID: ${customerInfo.id}`,
        balance: customerInfo.balance.total,
        can_spend: customerInfo.balance.unlocked,
        is_on_chain: customerInfo.is_on_chain
      };
      // Request how much bonuses the buyer will get if buy this articles set
      this.txInfo = await this._requestEarnedBonuses(this.payByBonuses);
    }
    else {
      // Here must be notification about some errors.
      this._notify("<div><b>Error! </b><br>Can not get Buyer's Info</div>");
    }
  }

  /**
   * Request how much bonuses buyer will get if buy this set of articles
   * @param {Number} spend    - how much bonuses will be spent
   * @returns {Object}        - txInfo object ${this.txInfo} OR undefined if some errors
   */
  async _requestEarnedBonuses(spend) {
    // make TX API request with commit=false
    const txData = await this._requestTxApi(spend, false);
    if (!txData) {
      // Here must be notification about some errors.
      this._notify("<div><b>Error! </b><br>Can not get Transaction Info</div>");
    }
    // Clear signed transaction
    this.txSigned = '';
    this.newAccountTxSigned = '';
    return txData;
  }

  /**
   * Request to do transaction over API
   * @param {Number} spend      - how much bonuses will be spent
   * @param {Boolean} isCommit  - dummy transaction if it is false
   * @returns {Object}          - response data object. Undefined if there are errors
   */
  async _requestTxApi(spend, isCommit) {
    let returnedData;
    const body = { method: 'make_buy_tx', data: { items: [], } };
    body.data.client_id = this.customer?.id;
    body.data.spend = spend;
    body.data.commit = isCommit;
    if (isCommit === true) {
      if (this.txSigned) body.data.spend_sign = this.txSigned;
      if (this.newAccountTxSigned) body.data.new_account_sign = this.newAccountTxSigned;
      if (this.txInfo.spend_raw_tx) body.data.spend_raw_tx = this.txInfo.spend_raw_tx;
      if (this.txInfo.new_account_raw_tx) body.data.new_account_raw_tx = this.txInfo.new_account_raw_tx;
    }

    body.data.items = this.articles.goods.map(article => ({...article, qty: article.quantity}));
    this._logging(`Make_buy_tx (commit: ${isCommit}) - Request body: ${JSON.stringify(body)}`);
    // make API request
    const txData = await this._makeApiRequest(body);
    if (txData) {
      returnedData = txData;
    }
    else {
      // Here must be notification about some errors.
      // this._notify("<div><b>Errors! </b><br>Can not accomplish this transation</div>");
      this._logging('Transaction errors!');
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
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const responseJson = await response.json();
      if (responseJson?.result?.res === 'OK') { returnData = responseJson.data; }
      this._logging(`API response data: ${JSON.stringify(responseJson)}`);
    } catch (error) {
      this._logging(`API Network Error Exception: ${error}`);
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
    // if filed has invalid value
    if (!e.target.validate()) {
      // this.payByBonuses = 0;
      // -- e.target.value = this.payByBonuses / 100;
      if (e.target.value) this._notify("<div><b>Warning! </b><br>Wrong Bonuses value</div>");
      // set ${this.isInputValid} into false to prevent click on "Finish" button.
      this.isInputValid = false;
    } else {
      this.payByBonuses = Math.round(e.target.value * 100);
      // set ${this.isInputValid} into true to allow click on "Finish" button.
      this.isInputValid = true;
      // Request how much bonuses buyer will get if buy this set of articles,
      // and transaction string which buyer have to sign.
      this.txInfo = await this._requestEarnedBonuses(this.payByBonuses);
    }
  }

  /**
   * Listener function on "Finish" button
   */
  async _finishButtonClick() {
    // Check if it is requesting API
    if (this.loading) return;
    // Some logic about txSign parameter may be here.
    // Some restrictions is placed into markup of render() already.

    // make real TX API request with commit=true
    const txData = await this._requestTxApi(this.payByBonuses, true);
    if (txData) {
      // In successful case
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
      this._notify("<div><b>Error</b><br>Can not accomplish this transation !</div>");
      // Some work may be here in unsuccessful case
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
    notification.position = position ?? 'bottom-start';
    notification.duration = duration ?? 4000;
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

  /**
   * Copy content of txField to clipboard
   */
  async _copyTxToClipboard(elementId) {
    const tx = this.shadowRoot.querySelector(elementId).value;
    try {
      await navigator.clipboard.writeText(tx);
      this._notify("<div>Transaction copied to clipboard !</div>", 'middle', 2000);
    } catch (err) {
      this._logging(`Failed to copy to clipboard: ${err}`);
      this._notify("<div><b>Error !</b><br>Failed to copy to clipboard (Not <b>HTTPS</b> connection)!</div>");
    }
  }

  /**
   * Logging
   */
  _logging(messages) {
    if (GLOBAL_PARAMS.isLogging || this._isLogging) console.log(messages);
  }
}
