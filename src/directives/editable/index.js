/**
 * Created by mjimenez on 10/30/16.
 */
import './index.scss';
export default function() {
  return {
    restrict: 'A',
    scope: {
      onChange: '&',
      onNoChange: '&',
      onChangeArgs: '&',
      editable: '=',
      maxLength: '=',
      eventChange: '@',
      verifyChange: '&',
      transform: '&',
      unselectRadio: '=',
      unselectRadioHandler: '@',
      placeholder: '@',
      editableId: '@'
    },
    link: (scope, elem, attrs) => {
      let currentValue      = '';
      let isInput           = elem.is('input,select,textarea');
      let isRadio           = isInput && elem.is('[type="radio"');
      let isCheckbox        = isInput && elem.is('[type="checkbox"]');
      let isTextarea        = isInput && elem.is('textarea');
      let isSelect          = isInput && elem.is('select');
      let focused           = false;

      function updateValue(val) {
        if(focused) return; // If its currently being edited abort the unregister
        currentValue = val;
        setTimeout(() => { elem[isInput ? 'val' : 'text'](val) });
        if(currentValue === undefined || currentValue === '' || currentValue === null) {
          elem.addClass('empty');
        }
      }
      //
      let unregister = scope.$watch('editable', updateValue);

      if(scope.editableId) {
        scope.$on(`${scope.editableId}:clear`, () => {
          updateValue('');
        });
      }

      // Setup paste event handler if this isn't an input element
      if(!isInput) {
        if(!scope.placeholder) {
          elem.attr('placeholder', 'EMPTY');
        }
        elem.attr('contenteditable', 'true');
        elem.on('paste', (e) => {
          e = e.originalEvent;
          let sel = window.getSelection();
          if (!sel.rangeCount) {
            return;
          }
          let range = sel.getRangeAt(0);
          if (range.commonAncestorContainer != elem[0] && range.commonAncestorContainer.parentNode != elem[0]) {
            return;
          }
          let currentText = elem.text();
          let clipboard = e.clipboardData.getData('text') || '';
          let startOffset = range.startOffset;
          let newValue = currentText.substring(0, startOffset) + clipboard + currentText.substring(range.endOffset);
          elem.text(newValue.substr(0, scope.maxLength));
          // Setting cursor at updated position
          let cursorPosition = startOffset + clipboard.length;
          if(scope.maxLength) {
            cursorPosition = Math.min(cursorPosition, scope.maxLength);
          }
          range = document.createRange();
          range.setStart(elem[0].childNodes[0], cursorPosition);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          e.preventDefault();
        });
      }

      // Add pencil icon after this element if its not an input element
      if(!isInput) {
        $('<span class="fa fa-pencil"></span>').on('click', () => {
          elem[0].focus();
          setTimeout(() => {
            let range = document.createRange();    //Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(elem[0]);     //Select the entire contents of the element with the range
            range.collapse(false);                 //collapse the range to the end point. false means collapse to end rather than the start
            let selection = window.getSelection(); //get the selection object (allows you to change selection)
            selection.removeAllRanges();           //remove any selections already made
            selection.addRange(range);             //make the range you have just created the visible selection
          });
        }).insertAfter(elem);
      }

      // To handle unselecting a radio button
      if(isRadio && scope.unselectRadio) {
        let handler = scope.unselectRadioHandler ? elem.siblings('.handler') : elem;
        handler.on('mousedown', e => {
          if( elem.is(':checked') ){
            let uncheck = function(){
              setTimeout(() => {
                elem.prop('checked', false);
                handleChange();
              });
            };
            let unbind = () => {
              handler.off('mouseup', up);
            };
            let up = () => {
              uncheck();
              unbind();
            };
            handler.on('mouseup',up);
            handler.one('mouseout', unbind);
          }
        });
      }

      if(!isCheckbox && !isRadio && !isSelect) {
        elem.on('focus', () => {
          focused = true;
        });
        elem.on('keypress', e => {
          e = e.originalEvent;
          if(e.keyCode == 13 && !isTextarea) {
            e.preventDefault();
            elem[0].blur();
          }
          else if(!isInput && scope.maxLength && elem.text().length >= scope.maxLength) {
            e.preventDefault();
          }
        });
      }
      elem.on(scope.eventChange || 'blur', handleChange);
      elem.on('$destroy', unregister);

      function handleChange() {
        focused = false;
        let verifyChange = scope.verifyChange();
        if(verifyChange && !verifyChange()) return;
        let newValue;
        if(isRadio || isCheckbox) {
          newValue = elem.is(':checked');
        }
        else {
          newValue = elem[isInput ? 'val' : 'text']().trim();
        }
        let transform = scope.transform();
        if(transform) {
          newValue = transform(newValue);
        }
        if(currentValue != newValue) {
          let args = scope.onChangeArgs() || [];
          if(!(args instanceof Array)) args = [args];
          args.push(newValue);
          Promise.resolve(scope.onChange().apply(scope, args))
            .catch(() => elem[isInput ? 'val' : 'text'](currentValue))
        }
        else {
          let noChange = scope.onNoChange();
          if(noChange) noChange(currentValue);
        }
        if(newValue === undefined || newValue === '' || newValue === null) {
          elem.addClass('empty');
        }
        else {
          elem.removeClass('empty');
        }
      }
    }
  }
}