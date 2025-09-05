let n = 0;

function addPhoto(button) {
    if (n >= 4) {
        return;
    }
    
    button.insertAdjacentHTML('afterbegin', 
        `<br><div style="display: block; width: 100%; margin-bottom: 15px;">
            <input type="file" name="foto" accept="image/*,.pdf"><br>
         </div><br><br>`
    );
    
    n++;
}