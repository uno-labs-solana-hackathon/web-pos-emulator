import { html } from 'lit-html';
import '../src/web-pos-emulator.js';

export default {
  title: 'WebPosEmulator',
  component: 'web-pos-emulator',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <web-pos-emulator
      style="--web-pos-emulator-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </web-pos-emulator>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
