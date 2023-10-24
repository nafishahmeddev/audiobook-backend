import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Theme } from '@mui/material';
import { mount } from 'enzyme';
import * as React from 'react';


const getThemeProviderWrappingComponent = (customTheme) => ({ children }) => (
    <StyledEngineProvider injectFirst>
    <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);

export const mountWithTheme = (component, theme) => {
  const wrapper = mount(component, {
    wrappingComponent: getThemeProviderWrappingComponent(theme),
  });
  return wrapper;
};