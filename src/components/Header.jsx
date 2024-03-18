import React from 'react';

export function Header() {
    const handleClickScrollAboutSection = () => {
        const element = document.getElementById('aboutSection');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleClickScrollProjectsSection = () => {
        const element = document.getElementById('projectsSection');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 z-50 p-0">
            {/* <div className="flex items-center justify-between px-10 py-5 w-screen" style={{ backdropFilter: 'blur(10px)', background: 'linear-gradient(rgba(0, 0, 0, 1), transparent)', mixBlendMode: 'overlay' }}> */}
            <div className="flex items-center justify-between px-10 py-5 w-screen" style={{ background: 'linear-gradient(rgba(0, 0, 0, 1), transparent)', mixBlendMode: 'overlay' }}>
                <div className="flex items-center">
                    <img className="h-10" src="/logo192.png" alt="logo" />
                    <h1 className="ml-2 text-2xl font-bold text-white">Arief R. Syauqie</h1>
                </div>
                <div className="flex items-center space-x-4 text-white">
                </div>
                <div id="hero-section">
                    <button className="btn" onClick={handleClickScrollAboutSection}>
                        About
                    </button>
                    <button className="btn" onClick={handleClickScrollProjectsSection}>
                        Projects
                    </button>
                </div>
            </div>
        </header>
    )
}