import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { UserProfile } from '../../store/reducers/userReducer';
import store from '../../store/store';
import ProfileSummary from './ProfileSummary';

describe('<ProfileSummary />', () => {
  describe.each`
    exists              | content                | buttonName
    ${'exists'}         | ${'user introduction'} | ${'edit'}
    ${'does not exist'} | ${'placeholder text'}  | ${'write'}
  `('when user introduction $exists', ({ exists, content, buttonName }) => {
    const introductionExists = exists === 'exists';
    const stubUserProfile: UserProfile = {
      userId: 42,
      introduction: introductionExists ? 'TEST_USER_PROFILE_INTRODUCTION' : '',
    };
    const initialText = introductionExists
      ? stubUserProfile.introduction
      : /does not have an introduction/i;
    const getIntroductionButton = () =>
      screen.getByRole('button', { name: /introduction/i });
    const getConfirmButton = () =>
      screen.getByRole('button', { name: 'Confirm' });
    const getCancelButton = () =>
      screen.getByRole('button', { name: 'Cancel' });
    const getIntroductionEditor = () =>
      screen.getByPlaceholderText(/tell us about yourself/i);
    let spyGet: jest.SpyInstance;

    beforeEach(() => {
      spyGet = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
        status: 200,
        data: stubUserProfile,
      }));
      const app = (
        <Provider store={store}>
          <ProfileSummary userId={42} />
        </Provider>
      );
      render(app);
    });

    afterEach(() => {
      spyGet.mockClear();
    });

    it(`renders ${content}`, () => {
      expect(screen.getByText(initialText)).toBeInTheDocument();
    });

    it(`renders ${buttonName} introduction button`, () => {
      const introductionButton = screen.getByRole('button', {
        name: RegExp(buttonName, 'i'),
      });
      expect(introductionButton).toBeInTheDocument();
      fireEvent.click(introductionButton);
      expect(getIntroductionEditor()).toBeInTheDocument();
      expect(getConfirmButton()).toBeInTheDocument();
      expect(getCancelButton()).toBeInTheDocument();
    });

    describe('and user tries to change introduction', () => {
      let spyPut: jest.SpyInstance;
      let introductionButton: HTMLElement;
      let textArea: HTMLElement;

      beforeEach(() => {
        spyPut = jest
          .spyOn(axios, 'put')
          .mockImplementation(async (_url, _data) => ({
            status: 200,
          }));
        introductionButton = getIntroductionButton();
        expect(introductionButton).toBeInTheDocument();
        fireEvent.click(introductionButton);
        textArea = getIntroductionEditor();
      });

      afterEach(() => {
        spyPut.mockClear();
      });

      it('handles introduction change', async () => {
        fireEvent.change(textArea, {
          target: {
            value: 'TEST_USER_PROFILE_INTRODUCTION_MODIFIED',
          },
        });
        fireEvent.click(getConfirmButton());
        const introduction = await screen.findByText(
          'TEST_USER_PROFILE_INTRODUCTION_MODIFIED'
        );
        expect(introduction).toBeInTheDocument();
        // 'write an introduction' button should change to 'edit introduction' button
        expect(
          screen.getByRole('button', { name: /edit/i })
        ).toBeInTheDocument();
        expect(spyPut).toHaveBeenCalledTimes(1);
      });

      it('does not submit empty introduction', async () => {
        fireEvent.change(textArea, {
          target: {
            value: '',
          },
        });
        expect(getConfirmButton()).toBeDisabled();
        fireEvent.click(getConfirmButton());
        expect(spyPut).not.toHaveBeenCalled();
      });

      it('cancels introduction change', async () => {
        const spyConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
        fireEvent.click(getCancelButton());
        const introduction = await screen.findByText(initialText);
        expect(introduction).toBeInTheDocument();
        expect(spyPut).not.toHaveBeenCalled();
        expect(spyConfirm).not.toHaveBeenCalled();
        spyConfirm.mockClear();
      });

      it('confirms before discarding changes', async () => {
        const spyConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
        fireEvent.change(textArea, {
          target: {
            value: 'TEST_USER_PROFILE_INTRODUCTION_MODIFIED',
          },
        });
        fireEvent.click(getCancelButton());
        const introduction = await screen.findByText(initialText);
        expect(introduction).toBeInTheDocument();
        expect(spyPut).not.toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledTimes(1);

        // You need to query the elements again here
        fireEvent.click(getIntroductionButton());
        expect(getIntroductionEditor()).toHaveValue(
          stubUserProfile.introduction
        );
        spyConfirm.mockClear();
      });

      it('does not discard changes if not confirmed', async () => {
        const spyConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
        fireEvent.change(textArea, {
          target: {
            value: 'TEST_USER_PROFILE_INTRODUCTION_MODIFIED',
          },
        });
        fireEvent.click(getCancelButton());
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveValue('TEST_USER_PROFILE_INTRODUCTION_MODIFIED');
        expect(spyPut).not.toHaveBeenCalled();
        expect(spyConfirm).toHaveBeenCalledTimes(1);
        spyConfirm.mockClear();
      });
    });
  });
});
