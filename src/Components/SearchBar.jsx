import React from 'react';
import { 
  Input, 
  InputGroup, 
  InputRightElement, 
  IconButton, 
  useColorModeValue,
  Box,
  useBreakpointValue
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = ({ onSearch, ...rest }) => {
  const hoverGlow = useColorModeValue(
    '0 0 8px orange, 0 0 10px orange',
    '0 0 8px teal, 0 0 10px teal'
  );

  // Responsive styles
  const maxWidth = useBreakpointValue({ base: '100%', md: '400px' });
  const marginX = useBreakpointValue({ base: 0, md: 4 });

  return (
    <Box width="100%" {...rest}>
      <InputGroup maxW={maxWidth} mx={marginX}>
        <Input
          placeholder="Search content..."
          _hover={{
            boxShadow: hoverGlow,
            transform: 'translateY(-2px)'
          }}
          _focus={{
            boxShadow: hoverGlow
          }}
          transition="all 0.3s ease"
          onChange={(e) => onSearch(e.target.value)}
        />
        <InputRightElement>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            variant="ghost"
            _hover={{
              transform: 'scale(1.1)',
              color: useColorModeValue('orange.500', 'teal.300')
            }}
            transition="all 0.3s ease"
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;






// import React from 'react';
// import { Input, InputGroup, InputRightElement, IconButton, useColorModeValue } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';

// const SearchBar = ({ onSearch }) => {
//   const hoverGlow = useColorModeValue(
//     '0 0 8px orange, 0 0 10px orange',
//     '0 0 8px teal, 0 0 10px teal'
//   );

//   return (
//     <InputGroup maxW="400px" mx={4}>
//       <Input
//         placeholder="Search content..."
//         _hover={{
//           boxShadow: hoverGlow,
//           transform: 'translateY(-2px)'
//         }}
//         _focus={{
//           boxShadow: hoverGlow
//         }}
//         transition="all 0.3s ease"
//         onChange={(e) => onSearch(e.target.value)}
//       />
//       <InputRightElement>
//         <IconButton
//           aria-label="Search"
//           icon={<SearchIcon />}
//           variant="ghost"
//           _hover={{
//             transform: 'scale(1.1)',
//             color: useColorModeValue('orange.500', 'teal.300')
//           }}
//           transition="all 0.3s ease"
//         />
//       </InputRightElement>
//     </InputGroup>
//   );
// };

// export default SearchBar;