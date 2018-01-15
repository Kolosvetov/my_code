<?php

/* /src/block/common/b-reference-information/b-reference-information.html.twig */
class __TwigTemplate_39baf91acfb457b35875302688bfd2f2597685e7b4c26d6d8da6137cba5e8a4c extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<div class=\"b-reference-information";
        echo (isset($context["addition_class"]) ? $context["addition_class"] : null);
        echo "\">
\t<div class=\"b-reference-information__head\">
\t\t<div class=\"b-reference-information__pickt\" style=\"background-image: url(";
        // line 3
        echo (isset($context["img"]) ? $context["img"] : null);
        echo ");\"></div>
\t\t<h2>";
        // line 4
        echo (isset($context["title"]) ? $context["title"] : null);
        echo "</h2>
\t\t<p class=\"grey big\">";
        // line 5
        echo (isset($context["announce"]) ? $context["announce"] : null);
        echo "</p>
\t</div>
\t<div class=\"b-reference-information__text\">
\t\t";
        // line 8
        echo (isset($context["text"]) ? $context["text"] : null);
        echo "
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "/src/block/common/b-reference-information/b-reference-information.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  39 => 8,  33 => 5,  29 => 4,  25 => 3,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/b-reference-information/b-reference-information.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/b-reference-information/b-reference-information.html.twig");
    }
}
