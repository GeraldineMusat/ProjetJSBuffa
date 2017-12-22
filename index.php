

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script type="text/javascript" src="javascript.js"></script>
    <link rel="stylesheet" href="css.css"/>
    <title>Projet Porte Ouverte MIAGE</title>
</head>
<body>
<form action = "index.php" methodd = "post">
    <p>

        Ton nom : <input id="name" name = "name" type="text">
        <!--<input type="button" value="Afficher nom" onclick="check();" />-->
         Ton age : <input id = "age" name = "age" type="text" size="2"/> ans <br/>
        <input type="submit" name = "valider" value="Valider" />
    </p>

</form>

<?php
if (isset($_POST['name']) && isset($_POST['age'])) {
    // on affiche nos résultats
    echo 'Votre nom est '.$_POST['name'].' et votre fonction est '.$_POST['age'];
}
?>

<p>
    <label >
        <h1>Ton niveau de formation </h1>
        <input type="radio" name="check" value="L2" /> L2<br />
        <input type="radio" name="check" value="L3" /> L3<br />
        <input type="radio" name="check" value="M1" /> M1<br />
        <input type="button" value="Afficher la formation" onclick="check();"/>
    </label>

</p>
<p>
    <label>
        <input type="button" value="GO !" onclick="initialisationPerso();"/>
    </label>
</p>
<br/>
<canvas width=600 height=600 id="myCanvas"></canvas>
<p style="display:none;"></p>
<select name="" style="display:none;">
    <option value="Q0">Clique et selectionne ta question !</option>
    <option value="Q1"></option>
    <option value="Q2"></option>
</select>
</body>
</html>


