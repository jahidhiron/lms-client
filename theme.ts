import { createTheme } from '@mantine/core';
export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: 'orange',
  components: {
    ListItem: {
      styles: { itemIcon: { display: 'flex', alignItems: 'center' } },
    },
  },
});
