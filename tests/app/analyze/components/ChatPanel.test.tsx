import {render, screen} from '@testing-library/react';
import ChatPanel from './../../../../src/app/analyze/components/ChatPanel';


it('should render ChatPanel component', () => {
    render(<ChatPanel 
                      result={null}
                      runPrompt={(_) => {return Promise.resolve(undefined)}}
                      error={null}
                      loading={false}
                      chatMessages={[]}
                      setChatMessages={(_) => {}}/>);
    expect(true).toBe(true);
})