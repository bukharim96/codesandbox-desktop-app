import * as React from 'react';
import SplitPane from 'react-split-pane';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';

import Fullscreen from 'common/components/flex/Fullscreen';
import getTemplateDefinition from 'common/templates';

import Workspace from '../../../../../../app/src/app/pages/Sandbox/Editor/Workspace';
import Content from './Content';
import Navigation from '../../../../../../app/src/app/pages/Sandbox/Editor/Navigation';

function ContentSplit({ signals, store, match }) {
  const sandbox = store.editor.currentSandbox;
  const sandboxOwned = sandbox.owned;

  const hideNavigation =
    (store.preferences.settings.zenMode &&
      !store.workspace.openedWorkspaceItem) ||
    !sandboxOwned;

  return (
    <ThemeProvider
      theme={{
        templateColor: sandbox && getTemplateDefinition(sandbox.template).color,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Fullscreen>
          {!hideNavigation && <Navigation />}

          <div
            style={{
              position: 'fixed',
              left: hideNavigation ? 0 : 'calc(4rem + 1px)',
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <SplitPane
              split="vertical"
              defaultSize={sandboxOwned ? 16 * 16 : 18 * 16}
              minSize={0}
              onDragStarted={() => signals.editor.resizingStarted()}
              onDragFinished={() => signals.editor.resizingStopped()}
              onChange={size => {
                if (size > 0 && !store.workspace.openedWorkspaceItem) {
                  signals.workspace.setWorkspaceItem({ item: 'files' });
                } else if (size === 0 && store.workspace.openedWorkspaceItem) {
                  signals.workspace.setWorkspaceItem({ item: null });
                }
              }}
              pane1Style={{
                visibility: store.workspace.openedWorkspaceItem
                  ? 'visible'
                  : 'hidden',
                maxWidth: store.workspace.openedWorkspaceItem ? 'inherit' : 0,
              }}
              pane2Style={{
                height: '100%',
              }}
            >
              {store.workspace.openedWorkspaceItem && <Workspace />}
              <Content match={match} />
            </SplitPane>
          </div>
        </Fullscreen>
      </div>
    </ThemeProvider>
  );
}

export default hot(module)(inject('signals', 'store')(observer(ContentSplit)));
