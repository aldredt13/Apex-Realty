// Photography used across the site.
// These point at free Unsplash stock so the site looks complete out of the box.
// Replace the URLs with Team APEX's own property / team photos before launch.

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  // Modern luxury home at dusk — home hero
  heroHouse: u("1600596542815-ffad4c1539a9"),
  // Modern house exterior — for sellers
  sellHouse: u("1600585154340-be6161a56a0c"),
  // Bright luxury living room — who we are
  livingRoom: u("1618221195710-dd6b41faaea6", 1200),
  // Interior / lifestyle — about
  interior: u("1600607687939-ce8a6c25118c", 1200),
  // Professional team — recruit banner + agents hero
  team: u("1521737604893-d14cc237f11d"),
  // Handshake / partnership — for agents
  handshake: u("1600880292203-757bb62b4baf", 1200),
  // Agent with client — about page
  agentMeeting: u("1560518883-ce09059eeffa", 1200),
};
