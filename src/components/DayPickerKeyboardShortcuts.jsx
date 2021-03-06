import React from 'react';
import PropTypes from 'prop-types';
import { forbidExtraProps } from 'airbnb-prop-types';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';

import KeyboardShortcutRow from './KeyboardShortcutRow';

import { DayPickerKeyboardShortcutsPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CloseButton from '../svg/close.svg';

export const TOP_LEFT = 'top-left';
export const TOP_RIGHT = 'top-right';
export const BOTTOM_RIGHT = 'bottom-right';

const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  block: PropTypes.bool,
  buttonLocation: PropTypes.oneOf([TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT]),
  showKeyboardShortcutsPanel: PropTypes.bool,
  openKeyboardShortcutsPanel: PropTypes.func,
  closeKeyboardShortcutsPanel: PropTypes.func,
  phrases: PropTypes.shape(getPhrasePropTypes(DayPickerKeyboardShortcutsPhrases)),
});

const defaultProps = {
  block: false,
  buttonLocation: BOTTOM_RIGHT,
  showKeyboardShortcutsPanel: false,
  openKeyboardShortcutsPanel() {},
  closeKeyboardShortcutsPanel() {},
  phrases: DayPickerKeyboardShortcutsPhrases,
};

class DayPickerKeyboardShortcuts extends React.Component {
  constructor(...args) {
    super(...args);

    this.onClick = this.onClick.bind(this);
    this.setShowKeyboardShortcutsButtonRef = this.setShowKeyboardShortcutsButtonRef.bind(this);
  }

  onClick() {
    const { openKeyboardShortcutsPanel } = this.props;

    // we want to return focus to this button after closing the keyboard shortcuts panel
    openKeyboardShortcutsPanel(() => { this.showKeyboardShortcutsButton.focus(); });
  }

  setShowKeyboardShortcutsButtonRef(ref) {
    this.showKeyboardShortcutsButton = ref;
  }

  render() {
    const {
      block,
      buttonLocation,
      showKeyboardShortcutsPanel,
      closeKeyboardShortcutsPanel,
      styles,
      phrases,
    } = this.props;

    const keyboardShortcuts = [{
      unicode: '↵',
      label: phrases.enterKey,
      action: phrases.selectFocusedDate,
    },
    {
      unicode: '←/→',
      label: phrases.leftArrowRightArrow,
      action: phrases.moveFocusByOneDay,
    },
    {
      unicode: '↑/↓',
      label: phrases.upArrowDownArrow,
      action: phrases.moveFocusByOneWeek,
    },
    {
      unicode: 'PgUp/PgDn',
      label: phrases.pageUpPageDown,
      action: phrases.moveFocusByOneMonth,
    },
    {
      unicode: 'Home/End',
      label: phrases.homeEnd,
      action: phrases.moveFocustoStartAndEndOfWeek,
    },
    {
      unicode: 'Esc',
      label: phrases.escape,
      action: phrases.returnFocusToInput,
    },
    {
      unicode: '?',
      label: phrases.questionMark,
      action: phrases.openThisPanel,
    },
    ];

    const toggleButtonText = showKeyboardShortcutsPanel
      ? phrases.hideKeyboardShortcutsPanel
      : phrases.showKeyboardShortcutsPanel;

    const bottomRight = buttonLocation === BOTTOM_RIGHT;
    const topRight = buttonLocation === TOP_RIGHT;
    const topLeft = buttonLocation === TOP_LEFT;

    return (
      <div>
        <button
          ref={this.setShowKeyboardShortcutsButtonRef}
          {...css(
            styles.DayPickerKeyboardShortcuts_buttonReset,
            styles.DayPickerKeyboardShortcuts_show,
            bottomRight && styles.DayPickerKeyboardShortcuts_show__bottomRight,
            topRight && styles.DayPickerKeyboardShortcuts_show__topRight,
            topLeft && styles.DayPickerKeyboardShortcuts_show__topLeft,
          )}
          type="button"
          aria-label={toggleButtonText}
          onClick={this.onClick}
          onMouseUp={(e) => {
            e.currentTarget.blur();
          }}
        >
          <span
            {...css(
              styles.DayPickerKeyboardShortcuts_showSpan,
              bottomRight && styles.DayPickerKeyboardShortcuts_showSpan__bottomRight,
              topRight && styles.DayPickerKeyboardShortcuts_showSpan__topRight,
              topLeft && styles.DayPickerKeyboardShortcuts_showSpan__topLeft,
            )}
          >
            ?
          </span>
        </button>

        {showKeyboardShortcutsPanel &&
          <div
            {...css(
              styles.DayPickerKeyboardShortcuts_panel,
              block && styles.DayPickerKeyboardShortcuts_panel__block,
            )}
            role="dialog"
            aria-labelledby="DayPickerKeyboardShortcuts__title"
          >
            <div
              {...css(styles.DayPickerKeyboardShortcuts_title)}
              id="DayPickerKeyboardShortcuts__title"
            >
              {phrases.keyboardShortcuts}
            </div>

            <button
              {...css(
                styles.DayPickerKeyboardShortcuts_buttonReset,
                styles.DayPickerKeyboardShortcuts_close,
              )}
              type="button"
              aria-label={phrases.hideKeyboardShortcutsPanel}
              onClick={closeKeyboardShortcutsPanel}
              onKeyDown={(e) => {
                // Because the close button is the only focusable element inside of the panel, this
                // amount to a very basic focus trap. The user can exit the panel by "pressing" the
                // close button or hitting escape
                if (e.key === 'Tab') {
                  e.preventDefault();
                }
              }}
            >
              <CloseButton {...css(styles.DayPickerKeyboardShortcuts_closeSvg)} />
            </button>

            <ul {...css(styles.DayPickerKeyboardShortcuts__list)}>
              {keyboardShortcuts.map(({ unicode, label, action }) => (
                <KeyboardShortcutRow
                  key={label}
                  unicode={unicode}
                  label={label}
                  action={action}
                  block={block}
                />
              ))}
            </ul>
          </div>
        }
      </div>
    );
  }
}

DayPickerKeyboardShortcuts.propTypes = propTypes;
DayPickerKeyboardShortcuts.defaultProps = defaultProps;

export default withStyles(({ reactDates: { color, zIndex } }) => ({
  DayPickerKeyboardShortcuts_buttonReset: {
    background: 'none',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    padding: 0,
    cursor: 'pointer',

    ':active': {
      outline: 'none',
    },
  },

  DayPickerKeyboardShortcuts_show: {
    width: 22,
    position: 'absolute',
    zIndex: zIndex + 2,
  },

  DayPickerKeyboardShortcuts_show__bottomRight: {
    borderTop: '26px solid transparent',
    borderRight: `33px solid ${color.core.primary}`,
    bottom: 0,
    right: 0,

    ':hover': {
      borderRight: `33px solid ${color.core.primary_dark}`,
    },
  },

  DayPickerKeyboardShortcuts_show__topRight: {
    borderBottom: '26px solid transparent',
    borderRight: `33px solid ${color.core.primary}`,
    top: 0,
    right: 0,

    ':hover': {
      borderRight: `33px solid ${color.core.primary_dark}`,
    },
  },

  DayPickerKeyboardShortcuts_show__topLeft: {
    borderBottom: '26px solid transparent',
    borderLeft: `33px solid ${color.core.primary}`,
    top: 0,
    left: 0,

    ':hover': {
      borderLeft: `33px solid ${color.core.primary_dark}`,
    },
  },

  DayPickerKeyboardShortcuts_showSpan: {
    color: color.core.white,
    position: 'absolute',
  },

  DayPickerKeyboardShortcuts_showSpan__bottomRight: {
    bottom: 0,
    right: -28,
  },

  DayPickerKeyboardShortcuts_showSpan__topRight: {
    top: 1,
    right: -28,
  },

  DayPickerKeyboardShortcuts_showSpan__topLeft: {
    top: 1,
    left: -28,
  },

  DayPickerKeyboardShortcuts_panel: {
    overflow: 'auto',
    background: color.background,
    border: `1px solid ${color.core.border}`,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: zIndex + 2,
    padding: 22,
    margin: 33,
  },

  DayPickerKeyboardShortcuts_title: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
  },

  DayPickerKeyboardShortcuts_list: {
    listStyle: 'none',
    padding: 0,
  },

  DayPickerKeyboardShortcuts_close: {
    position: 'absolute',
    right: 22,
    top: 22,
    zIndex: zIndex + 2,

    ':active': {
      outline: 'none',
    },
  },

  DayPickerKeyboardShortcuts_closeSvg: {
    height: 15,
    width: 15,
    fill: color.core.grayLighter,

    ':hover': {
      fill: color.core.grayLight,
    },

    ':focus': {
      fill: color.core.grayLight,
    },
  },
}))(DayPickerKeyboardShortcuts);
