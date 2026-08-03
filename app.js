/**
 * FUNNGRO PLAYABLE JOURNEY APP
 * Handles Game State, DOM Updates, and GSAP Animations
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. GAME STATE MANAGEMENT
    // ==========================================
    const State = {
        player: {
            name: "",
            money: 0,
            level: "Intern",
            clicks: 0
        },
        milestones: [
            { clicks: 1, amount: 50, message: "First income! 🎯" },
            { clicks: 2, amount: 150, message: "Client trusted you again! 🤝" },
            { clicks: 3, amount: 650, message: "Reviews are improving! ⭐" },
            { clicks: 4, amount: 1650, message: "You're getting noticed! 🔥" },
            { clicks: 5, amount: 3650, message: "High Performer Unlocked! 🏆" }
        ],
        updateMoney(amount) {
            this.player.money = amount;
            Animations.countMoney(amount);
        }
    };

    // ==========================================
    // 2. ANIMATION CONTROLLER (GSAP)
    // ==========================================
    const Animations = {
        initIntro() {
            const tl = gsap.timeline();
            tl.fromTo(".word", 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, ease: "power2.out" }
            )
            .fromTo(".hero-subtext",
                { opacity: 0 },
                { opacity: 1, duration: 0.8 },
                "+=0.2"
            )
            .fromTo("#btn-begin",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        },

        transitionScene(fromId, toId) {
            const fromScene = document.getElementById(fromId);
            const toScene = document.getElementById(toId);
            
            gsap.to(fromScene, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    fromScene.classList.remove('active');
                    fromScene.classList.add('hidden');
                    
                    toScene.classList.remove('hidden');
                    toScene.classList.add('active');
                    
                    gsap.fromTo(toScene, 
                        { opacity: 0, scale: 0.98 },
                        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
                    );
                }
            });
        },

        countMoney(targetAmount) {
            const counter = document.getElementById('money-counter');
            if (window.countUp) {
                const numAnim = new countUp.CountUp(counter, targetAmount, {
                    duration: 2,
                    useEasing: true,
                    separator: ','
                });
                if (!numAnim.error) numAnim.start();
            } else {
                counter.innerText = targetAmount;
            }
        },

        showToast(message) {
            const toast = document.getElementById('achievement-toast');
            toast.innerText = message;
            toast.classList.remove('hidden');
            
            gsap.fromTo(toast,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
            );

            // Hide after 2 seconds
            setTimeout(() => {
                gsap.to(toast, { opacity: 0, y: -20, duration: 0.3 });
            }, 2000);
        }
    };

    // ==========================================
    // 3. EVENT LISTENERS & LOGIC FLOW
    // ==========================================
    
    // Start Intro Animation
    Animations.initIntro();

    // Scene 1 -> 2 (Begin)
    document.getElementById('btn-begin').addEventListener('click', () => {
        Animations.transitionScene('scene-1', 'scene-2');
    });

    // Scene 2 -> 3 (Submit Name)
    document.getElementById('btn-name-submit').addEventListener('click', () => {
        const nameInput = document.getElementById('player-name').value.trim();
        if (nameInput) {
            State.player.name = nameInput;
            document.getElementById('display-name-reality').innerText = nameInput;
            document.getElementById('display-name').innerText = nameInput;
            Animations.transitionScene('scene-2', 'scene-3');
        } else {
            // Shake animation for empty input
            gsap.fromTo("#player-name", { x: -10 }, { x: 10, yoyo: true, repeat: 3, duration: 0.1 });
        }
    });

    // Scene 3 -> 4 (Reality Check Choice)
    const handleRealityChoice = () => Animations.transitionScene('scene-3', 'scene-4');
    document.getElementById('btn-earn-nothing').addEventListener('click', handleRealityChoice);
    document.getElementById('btn-earn-enough').addEventListener('click', handleRealityChoice);

    // Scene 4: Earning Logic
    document.getElementById('btn-complete-project').addEventListener('click', () => {
        State.player.clicks++;
        
        // Find if current click matches a milestone
        const milestone = State.milestones.find(m => m.clicks === State.player.clicks);
        
        if (milestone) {
            State.updateMoney(milestone.amount);
            Animations.showToast(milestone.message);
            
            // If final toffee milestone reached, show next phase button
            if (State.player.clicks === 5) {
                document.getElementById('btn-next-phase').classList.remove('hidden');
                gsap.fromTo("#btn-next-phase", { opacity: 0, y: 10 }, { opacity: 1, y: 0, delay: 1 });
            }
        }
    });

    // Scene 4 -> Finale (Skip Skill tree for this simplified flow)
    document.getElementById('btn-next-phase').addEventListener('click', () => {
        Animations.transitionScene('scene-4', 'scene-finale');
    });
});
