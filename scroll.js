        let selectedMinute = 0;
        let selectedSecond = 0;
        let formSubmenuTimerSet = false;
        let formSubmenuTimerTime = null;

        function populateScrollBox(id, range) {
            const box = document.getElementById(id);
            for (let i = 0; i < range; i++) {
                let div = document.createElement("div");
                div.textContent = i.toString().padStart(2, '0');
                div.onclick = function() {
                    selectTime(id, div, i);
                };
                box.appendChild(div);
            }
            box.addEventListener('scroll', () => {
                let items = box.children;
                let closest = null;
                let minDiff = Infinity;
                for (let item of items) {
                    let diff = Math.abs(item.offsetTop - box.scrollTop);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = item;
                    }
                }
                if (closest) {
                    selectTime(id, closest, parseInt(closest.textContent));
                }
            });
        }

        function selectTime(id, element, value) {
            document.querySelectorAll(`#${id} div`).forEach(el => el.classList.remove("selected"));
            element.classList.add("selected");
            if (id === "minutes") selectedMinute = value;
            else selectedSecond = value;
        }

        function setFormSubmenuTimer() {
            formSubmenuTimerTime = new Date();
            formSubmenuTimerTime.setMinutes(selectedMinute);
            formSubmenuTimerTime.setSeconds(selectedSecond);
            formSubmenuTimerTime.setMilliseconds(0);
            formSubmenuTimerSet = true;
            document.getElementById("form-submenu-timer-status").textContent = `Timer added for ${selectedMinute}:${selectedSecond.toString().padStart(2, '0')}`;
        }

        setInterval(() => {
            if (formSubmenuTimerSet) {
                let now = new Date();
                if (now.getMinutes() === formSubmenuTimerTime.getMinutes() && now.getSeconds() === formSubmenuTimerTime.getSeconds()) {
                    alert("Form-Submenu-Timer! Time's up!");
                    formSubmenuTimerSet = false;
                }
            }
        }, 1000);

        populateScrollBox("minutes", 60);
        populateScrollBox("seconds", 60);
