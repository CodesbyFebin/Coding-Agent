import { NavLink, useNavigate } from 'react-router-dom';
import { Flex, Text, Box } from '@chakra-ui/react';
import { MOBILE_NAV_ITEMS } from './navItems';

// Mobile bottom navigation. Mirrors the prototype's <nav class="mobile-nav">:
// Home / Projects / plus Run / Missions / More. The "Run" plus button is an
// emphasized composer trigger that routes to the Command Center rather than a
// distinct page.
export const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <Flex
      as="nav"
      aria-label="Mobile navigation"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      h="66px"
      borderTop="1px solid"
      borderColor="sovereign.line"
      bg="#0a0d11"
      zIndex={60}
      pb="env(safe-area-inset-bottom)"
      display={{ base: 'grid', md: 'none' }}
      gridTemplateColumns={`repeat(${MOBILE_NAV_ITEMS.length},1fr)`}
    >
      {MOBILE_NAV_ITEMS.map((item) =>
        item.isPlus ? (
          <Flex
            as="button"
            key={item.label}
            justify="center"
            align="center"
            bg="transparent"
            border="0"
            cursor="pointer"
            onClick={() => navigate('/')}
            color="sovereign.dim"
            fontSize="9px"
            fontWeight={700}
          >
            <Box
              as="span"
              w="44px"
              h="44px"
              mt="-18px"
              rounded="16px"
              bg="sovereign.accent"
              color="white"
              display="grid"
              placeItems="center"
              fontFamily="mono"
              fontWeight={900}
              fontSize="17px"
              boxShadow="0 8px 30px rgba(255,90,31,0.28)"
            >
              {item.glyph}
            </Box>
          </Flex>
        ) : (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'grid',
              placeItems: 'center',
              alignContent: 'center',
              gap: '3px',
              border: 0,
              background: 'transparent',
              fontSize: '9px',
              fontWeight: 700,
              color: isActive ? '#ff5a1f' : '#596771',
              textDecoration: 'none',
            })}
          >
            <Text as="span" fontFamily="mono" fontWeight={900} fontSize="15px">
              {item.glyph}
            </Text>
            {item.label}
          </NavLink>
        )
      )}
    </Flex>
  );
};
