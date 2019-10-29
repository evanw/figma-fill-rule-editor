figma.showUI(__html__, {
  width: 400,
  height: 400,
});

let updateTimeout = 0;
let updateCounter = 0;
let prevMsg = '';

function update(): void {
  clearTimeout(updateTimeout);

  const selection = figma.currentPage.selection;
  const node = selection.length === 1 ? selection[0] : null;
  const msg = {
    node: node === null || node.type !== 'VECTOR' ? null : {
      id: node.id,
      vectorNetwork: node.vectorNetwork,
    },
  };

  const msgStr = JSON.stringify(msg);
  if (msgStr !== prevMsg) {
    prevMsg = msgStr;
    figma.ui.postMessage(msg);
    updateCounter = 0;
  }

  const timeout = updateCounter++ < 20 ? 16 : 250;
  updateTimeout = setTimeout(update, timeout);
}

figma.on('selectionchange', update);
update();

figma.ui.onmessage = msg => {
  if (msg.node) {
    const node = figma.getNodeById(msg.node.id);
    if (node !== null && node.type === 'VECTOR') {
      node.vectorNetwork = msg.node.vectorNetwork;
    }
  }
};
