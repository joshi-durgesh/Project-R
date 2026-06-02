export function getBottomNav(currentPath, router) {
  const navContainer = document.createElement('nav');
  navContainer.className = 'bottom-nav animate-fade-in';
  
  const items = [
    { id: 'home', path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'sos', path: '/emergency', label: 'SOS', icon: '🚨' }
  ];

  items.forEach(item => {
    const a = document.createElement('a');
    a.className = `nav-item ${currentPath === item.path ? 'active' : ''}`;
    a.innerHTML = `
      <span style="font-size: 1.5rem;">${item.icon}</span>
      <span>${item.label}</span>
    `;
    a.onclick = (e) => {
      e.preventDefault();
      router.navigate(item.path);
    };
    navContainer.appendChild(a);
  });

  return navContainer;
}
