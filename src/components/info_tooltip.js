export default function infoTooltip() {
    const info = document.querySelector(".info");
    const tooltip = document.querySelector(".info div");

    info.addEventListener("mouseover", () => {
        tooltip.className = "";
    })
    info.addEventListener("mouseout", () => {
        tooltip.className = "none";
    });
}
