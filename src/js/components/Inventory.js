// import { map } from 'lodash';
// import React, { Component, PropTypes } from 'react';
//
// import base from '../base';
// import { ItemTypes } from '../constants';
// import DraggableItem from './DraggableItem';
// import GenericDropTarget from './GenericDropTarget';
//
// const allItemTypes = map(ItemTypes, (t) => t);
//
// class Inventory extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: [],
//       isLoading: true,
//     };
//
//     this.handleDrop = this.handleDrop.bind(this);
//   }
//   componentDidMount(){
//     const { characterKey, uid } = this.props;
//
//     this.ref = base.bindToState(`users/${uid}/characters/${characterKey}/items`, {
//       context: this,
//       state: 'items',
//       asArray: true,
//       keepKeys: true,
//       then: () => {
//         this.setState({isLoading: false})
//       },
//     });
//   }
//   componentWillUnmount(){
//     base.removeBinding(this.ref);
//   }
//   handleDrop(data) {
//     const { characterKey, uid } = this.props;
//     const { item } = data;
//     if(item.slot) {
//       // unequip item
//       base.remove(`users/${uid}/characters/${characterKey}/items/${item.key}/slot`);
//     }
//   }
//   render() {
//     const { items } = this.state;
//
//     return (
//       <div className="pane">
//         <div className="pane__heading">Bag</div>
//         <div className="pane__content">
//           <GenericDropTarget
//             className="inventory"
//             accepts={allItemTypes}
//             onDrop={this.handleDrop}
//           >
//             {map(items, (item) => item.slot ? null :
//               <div key={item.key} className="itemslot">
//                 <DraggableItem item={item} />
//               </div>
//             )}
//           </GenericDropTarget>
//         </div>
//       </div>
//     );
//   }
// }
//
// Inventory.propTypes = {
//   uid: PropTypes.string.isRequired,
//   characterKey: PropTypes.oneOfType([
//     PropTypes.number,
//     PropTypes.string,
//   ]).isRequired,
// };
//
// export default Inventory;
