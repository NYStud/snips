import {
  isValidHex,
  getRandomColor
} from '../../utils/utils.js';

export default {
  name: 'Sidebar',

  data() {
    return {
      activeEl: 'All',
      labelMenuOpen: false,
      color: getRandomColor()
    }
  },

  mounted() {
    const labelBtn = $('#add-label .menu');

    // Set randomize button with current color value
    $('.random-button').css({ background: this.color });

    $('#add-label .plus').on('click', () => labelBtn.toggle());

    // Prevent label menu from closing
    $('.labels-wrapper').on('click', (e) => e.stopPropagation());

    $('#app').on('click', () => {
      if (labelBtn.is(':visible')) {
        labelBtn.toggle();
      }
    });
  },

  computed: {
    pinnedSnippets() {
      return this.$store.state.snippets.filter(snip => snip.isPinned);
    },
    snippetCount() {
      return this.$store.state.snippets.length;
    },
    languages() {
      const languages = {};
      const snippets = this.$store.state.snippets;

      // Alphabetize all stored snippet languages
      const sortedLanguages = snippets.sort((a, b) => {
        return a.language > b.language;
      });

      // Store the count value of each language
      Object.keys(sortedLanguages).forEach(s => {
        const lang = sortedLanguages[s].language.toLowerCase();

        if (lang !== '') {
          languages[lang] = languages[lang] ? languages[lang] + 1 : 1;
        }
      });

      return languages;
    },
    isLoggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    getAvatar() {
      return this.$store.state.auth.avatar;
    }
  },

  methods: {
    setColor() {
      const labelColorInput = $('.color');
      const colorWarning = $('#color-warn');
      const randomColorBtn = $('.random-button');

      // Color is now valid, hide warning
      colorWarning.hide();

      this.color = getRandomColor();
      labelColorInput.val(this.color);
      randomColorBtn.css({ background: this.color });
      labelColorInput.css({ color: 'rgba(0,0,0,.87)' });      
    },

    validateColor(event) {
      const { target } = event;
      const { value } = event.target;
      const colorWarning = $('#color-warn');      
      const randomColorBtn = $('.random-button');

      if (isValidHex(value)) {
        colorWarning.hide();
        $(target).css({ color: 'rgba(0,0,0,.87)' });
        randomColorBtn.css({ background: value });
      } else {
        $(target).css({ color: '#db2828' });
      }
    },

    validateLabel() {
      const name = $('.label-input input').val();
      const labelWarning = $('#label-warn');
      const colorWarning = $('#color-warn');
      const warning = $('.popup');
      const label = {
        name: name,
        color: this.color
      };
      const hasLabel = this.$store.getters.getLabel(label.name).length;

      if (name === '') return;

      if (! isValidHex(this.color)) {
        colorWarning.show();
      } else if (hasLabel) {
        console.log(hasLabel);
        labelWarning.show();
      } else {
        this.$store.commit('addLabel', label);
        this.resetLabelForm();
      }
    },

    resetLabelForm() {
      const name = $('.label-input input');
      const labelWarning = $('#label-warn');
      const colorWarning = $('#color-warn');

      name.val('');
      colorWarning.hide();
      labelWarning.hide();
    },

    setLanguage(language) {
      this.activeEl = language;

      this.$store.commit('setLanguageFilter', language);
    }
  }
};