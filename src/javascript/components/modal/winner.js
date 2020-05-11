import { createElement } from '../../helpers/domHelper'; 
import { showModal } from './modal';

export function showWinnerModal(fighter) {
  const onModalClose = () => {
    console.log('Match finished.');
    location.reload();
  };

  const { name, source } = fighter;
  const title = `${name} wins. Supreme power`;

  const winnerBodyElement = createElement({
    tagName: 'div',
  });

  const fighterImageElement = createElement({
    tagName: 'img',
    attributes: {
      src: source
    }
  });

  winnerBodyElement.append(fighterImageElement);

  // call showModal function 
  showModal({ 
    title: title, 
    bodyElement: winnerBodyElement, 
    onClose: onModalClose
  });
}
