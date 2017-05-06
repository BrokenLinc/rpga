// import React from 'react';
import ReactDOM from 'react-dom';

import '../css/app.less';
import App from './components/App';

// $(document)
//   .on('mouseleave', '.is-swipeable', function(e) {
//     $(this).removeClass('is-hovered');
//   })
//   .on('mouseenter', '.is-swipeable a', function(e) {
//     // don't allow clicks on focusable children to trigger the hover
//     // note, this makes the links dead to mouseenter for the swipeable
//     // so add some padding around links
//     e.stopPropagation();
//   })
//   .on('mouseenter', '.is-swipeable', function(e) {
//     if(e.originalEvent.type !== 'mouseover') return;
//     $(this).addClass('is-hovered');
//   });

// var hammertime = new Hammer(document);
// hammertime.on('swipe tap', function(e) {
//   $('.is-swiped-left').removeClass('is-swiped-left');
//   $('.is-swiped-right').removeClass('is-swiped-right');
// });
// hammertime.on('swipe', function(e) {
//   e.preventDefault();
//   e.stopPropagation();
//   if(e.pointerType === 'mouse') return;
//
//   $(e.srcEvent.target).closest('.is-swipeable')
//     .toggleClass('is-swiped-left' , e.angle > 150 && e.angle < 201)
//     .toggleClass('is-swiped-right', e.angle > 330 || e.angle < 30);
// });

// http://techqa.info/programming/question/37808180/disable-viewport-zooming-ios-10-safari
const preventDocumentZoom = () => {
  document.documentElement.addEventListener('touchstart', (e) => {
    if(e.touches.length > 1) {
      e.preventDefault();
    }
  });

  let lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    if(now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};
preventDocumentZoom();

// var hammertime = new Hammer(document);
// hammertime.get('pinch').set({ enable: false });
// hammertime.on('pinch pinchstart pinchmove pinchend pinchcancel pinchin pinchout', function(e) {
//   e.preventDefault();
//   e.stopPropagation();
//   return false;
// });

ReactDOM.render(<App/>,document.getElementById('app'));
